// Normalize library use, which dependencies/utils do we prefer
import {
  decodeToken,
  createUnsignedToken,
  SECP256K1Client,
  TokenSigner
} from 'jsontokens';
import Transaction from 'ethereumjs-tx';
import { BN as _BN, bufferToHex } from 'ethereumjs-util';
const BN = _BN;
import { txutils } from 'eth-signer/dist/eth-signer-simple.js';
import EthJS from 'ethjs-query';
import HttpProvider from 'ethjs-provider-http';
import UportLite from 'uport-lite';
const verifyJWT = require('uport').JWT.verifyJWT;
import nets from 'nets';
import { Contract } from 'uport';
import { privateToPublic, pubToAddress } from 'ethereumjs-util';
import { decode } from 'bs58';
import { decodeEvent } from 'ethjs-abi';
import { randomBuffer } from 'secure-random';
// TODO return to smaller lib
// const IPFS = require('ipfs-mini');
import IPFS from 'ipfs-api';
import { cid, path as _path } from 'is-ipfs';
import { signers } from 'eth-signer';
const SimpleSigner = signers.SimpleSigner;
const IMProxySigner = signers.IMProxySigner;
import urlDecode from 'urldecode';
import { readFile } from 'fs';
import deploy from './deploy.js';
import { encode } from 'mnid';

const tryRequire = path => {
  try {
    return require(path);
  } catch (err) {
    return null;
  }
};

import { IdentityManager as _IdentityManager } from 'uport-identity';
import { abi } from 'uport-registry';
const IdentityManagerArtifact = _IdentityManager.v1;

// TODO need to import identity manager Adresses

const networks = {
  mainnet: {
    id: '0x1',
    registry: '0xab5c8051b9a1df1aab0149f8b0630848b7ecabf6',
    rpcUrl: 'https://mainnet.infura.io'
  },
  ropsten: {
    id: '0x3',
    registry: '0x41566e3a081f5032bdcad470adb797635ddfe1f0',
    rpcUrl: 'https://ropsten.infura.io'
  },
  kovan: {
    id: '0x2a',
    registry: '0x5f8e9351dc2d238fb878b6ae43aa740d62fc9758',
    rpcUrl: 'https://kovan.infura.io'
  },
  rinkeby: {
    id: '0x4',
    registry: '0x2cc31912b2b0f3075a87b3640923d45a26cef3ee',
    rpcUrl: 'https://rinkeby.infura.io'
  }
};

const DEFAULTNETWORK = 'rinkeby';

const configNetwork = (net = DEFAULTNETWORK) => {
  if (typeof net === 'object') {
    ['id', 'registry', 'rpcUrl'].forEach(key => {
      if (!net.hasOwnProperty(key))
        throw new Error(
          `Malformed network config object, object must have '${key}' key specified.`
        );
    });
    return net;
  } else if (typeof net === 'string') {
    if (!networks[net])
      throw new Error(`Network configuration not available for '${net}'`);
    return networks[net];
  }

  throw new Error(`Network configuration object or network string required`);
};

const genKeyPair = () => {
  const privateKey = randomBuffer(32);
  const publicKey = privateToPublic(privateKey);
  return {
    privateKey: `0x${privateKey.toString('hex')}`,
    publicKey: `0x04${publicKey.toString('hex')}`,
    address: `0x${pubToAddress(publicKey).toString('hex')}`
  };
};

const getUrlParams = url =>
  url
    .match(/[^&?]*?=[^&?]*/g)
    .map(param => param.split('='))
    .reduce((params, param) => {
      params[param[0]] = param[1];
      return params;
    }, {});

const funcToData = funcStr => {
  const name = funcStr.match(/.*\(/g)[0].slice(0, -1);
  const [type, args] = funcStr
    .match(/\(.*\)/g)[0]
    .slice(1, -1)
    .split(',')
    .map(str => str.trim().split(' '))
    .reduce(
      (arrs, param) => {
        arrs[0].push(param[0]);
        arrs[1].push(param[1]);
        return arrs;
      },
      [[], []]
    );
  return `0x${txutils._encodeFunctionTxData(name, type, args)}`;
};

const intersection = (obj, arr) =>
  Object.keys(obj).filter(key => arr.includes(key));
const filterCredentials = (credentials, keys) =>
  [].concat.apply([], keys.map(key => credentials[key].map(cred => cred.jwt)));

const SimpleResponseHandler = (res, url) =>
  new Promise((resolve, reject) => resolve(res));

const serialize = uportClient => {
  // TODO covers most cases, but also deal with passed in config functions
  const jsonClientState = {
    id: uportClient.id,
    network: uportClient.network,
    info: uportClient.info,
    credentials: uportClient.credentials,
    ipfsConfig: uportClient.ipfsUrl,
    deviceKeys: uportClient.deviceKeys,
    recoveryKeys: uportClient.recoveryKeys,
    mnid: uportClient.mnid,
    initialized: uportClient.initialized
  };
  return JSON.stringify(jsonClientState);
};

const deserialize = str => {
  const jsonClientState = JSON.parse(str);
  const uportClient = new UPortClient(jsonClientState, {
    credentials: jsonClientState.credentials
  });
  // Some of uport client could be refactored to handle this through configs, but won't change this interface once changed
  uportClient.id = jsonClientState.id;
  uportClient.mnid = jsonClientState.mnid;
  uportClient.initTokenSigner();
  uportClient.initSimpleSigner();
  uportClient.initTransactionSigner(uportClient.identityManagerAddress);
  return uportClient;
};

const HTTPResponseHandler = (res, url) => {
  // Chasqui specific
  if (!url) return new Promise((resolve, reject) => resolve(res));
  if (!!url.match(/chasqui.uport.me/g)) {
    return new Promise((resolve, reject) => {
      nets(
        {
          uri: urlDecode(url),
          json: true,
          method: 'GET',
          withCredentials: false,
          rejectUnauthorized: false
        },
        (err, resp, body) => {
          if (err) reject(err);
          post(res, url).then(resolve, reject);
        }
      );
    });
  }
  return post(res, url);
};

const post = (res, url) =>
  new Promise((resolve, reject) => {
    nets(
      {
        body: JSON.stringify({ access_token: res }),
        url: urlDecode(url),
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        }
      },
      (err, resp, body) => {
        if (err) reject(err);
        resolve(resp);
      }
    );
  });

const responseHandlers = {
  simple: SimpleResponseHandler,
  http: HTTPResponseHandler
};

const prommiseTimeOut = msec => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, msec);
  });
};

const configResponseHandler = (responseHandler = 'simple') => {
  if (typeof responseHandler === 'function') return responseHandler;
  if (typeof responseHandler === 'string') {
    if (!responseHandlers[responseHandler])
      throw new Error(
        `Response handler configuration not available for '${net}'`
      );
    return responseHandlers[responseHandler];
  }
  throw new Error(`Not a valid responseHandler`);
};

const isShareRequest = uri => !!uri.match(/:me\?.*requestToken/g);
const isSimpleRequest = uri => !!uri.match(/:me\?/g);
const isTransactionRequest = uri => !!uri.match(/:0[xX][0-9a-fA-F]+\?/g);
const isAddAttestationRequest = uri => !!uri.match(/add\?/g);

class UPortClient {
  constructor(config = {}, initState = {}) {
    // Handle this differently once there is a test and full client
    this.responseHandler = configResponseHandler(config.responseHandler);
    // {key: value, ...}
    this.info = initState.info || {};
    // this.credentials = {address: [{jwt: ..., json: ....}, ...], ...}
    this.credentials = initState.credentials || {};

    this.deviceKeys = config.deviceKeys;
    this.recoveryKeys = config.recoveryKeys;

    this.network = config.network ? configNetwork(config.network) : null; // have some default connect/setup testrpc

    if (this.network) {
      // Eventually consume an ipfs api client or at least some wrapper that allows a mock to be passed in
      this.ipfsUrl = config.ipfsConfig || 'https://ipfs.infura.io/ipfs/';
      // ^ TODO better ipfs config, pass in opts after or url above
      this.ipfs = new IPFS({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https'
      });

      this.registryNetwork = {
        [this.network.id]: {
          registry: this.network.registry,
          rpcUrl: this.network.rpcUrl
        }
      };
      const registry =
        config.registry ||
        new UportLite({ networks: this.registryNetwork, ipfsGw: this.ipfsUrl });
      //  TODO change this in uport-js or in uport-lite, should not be necessary
      this.registry = address =>
        new Promise((resolve, reject) => {
          registry(address, (error, profile) => {
            if (error) return reject(error);
            resolve(profile);
          });
        });

      this.verifyJWT = jwt => verifyJWT({ registry: this.registry }, jwt);

      this.provider = config.provider || new HttpProvider(this.network.rpcUrl);
      this.ethjs = this.provider ? new EthJS(this.provider) : null;

      // TODO how to config this
      this.registryAddress = this.network.registry;
      this.identityManagerAddress = this.network.identityManager;

      this.initialized = config.initialized || false;

      this.consume = this.consume.bind(this); // Bind consume method to make it compatible with other uport libraries.
    }
  }

  initKeys() {
    if (!this.deviceKeys) this.deviceKeys = genKeyPair();
    if (!this.recoveryKeys) this.recoveryKeys = genKeyPair();
    this.initTokenSigner();
    this.initSimpleSigner();
  }

  initTokenSigner() {
    const tokenSigner = new TokenSigner(
      'ES256k',
      this.deviceKeys.privateKey.slice(2)
    ); // Remove 0x prefix from private key
    this.signer = tokenSigner.sign.bind(tokenSigner);
  }

  initSimpleSigner() {
    this.simpleSigner = new SimpleSigner({
      privateKey: this.deviceKeys.privateKey,
      publicKey: this.deviceKeys.publicKey,
      address: this.deviceKeys.address
    });
    this.transactionSigner = this.simpleSigner; //TODO Make less confusing, uses simpler signer until identity created then uses identity specific signer
  }

  initTransactionSigner(IdentityManagerAdress) {
    this.transactionSigner = new IMProxySigner(
      this.id,
      this.simpleSigner,
      IdentityManagerAdress
    );
  }

  appDDO(name, description, url, img) {
    return new Promise((resolve, reject) => {
      const DDO = { '@type': 'App' };
      if (name) DDO.name = name;
      if (description) DDO.description = description;
      if (url) DDO.url = url;
      if (img) {
        if (cid(img)) {
          DDO.image = { contentUrl: `/ipfs/${img}` };
          resolve(DDO);
        } else if (_path(img)) {
          DDO.image = { contentUrl: img };
          resolve(DDO);
        } else {
          readFile(img, (err, data) => {
            if (err) {
              reject(new Error(err));
            } else {
              this.ipfs.files.add(data, (err, result) => {
                if (err) {
                  reject(new Error(err));
                } else {
                  const imgHash = result[0].hash;
                  DDO.image = { contentUrl: `/ipfs/${imgHash}` };
                  resolve(DDO);
                }
              });
            }
          });
        }
      } else {
        resolve(DDO);
      }
    });
  }

  getReceipt(txHash) {
    let receipt;
    return this.ethjs
      .getTransactionReceipt(txHash)
      .then(res => {
        if (res !== null) {
          receipt = res;
          return;
        }
        return prommiseTimeOut(1000);
      })
      .then(() => {
        if (receipt) return receipt;
        return this.getReceipt(txHash);
      });
  }

  initializeIdentity(initDdo) {
    if (!this.network)
      return Promise.reject(new Error('No network configured'));
    const IdentityManagerAdress = this.identityManagerAddress;
    const IdentityManager = Contract(IdentityManagerArtifact.abi).at(
      IdentityManagerAdress
    ); // add config for this
    this.initKeys();
    const uri = IdentityManager.createIdentity(
      this.deviceKeys.address,
      this.recoveryKeys.address
    );

    return this.consume(uri)
      .then(this.getReceipt.bind(this))
      .then(receipt => {
        const log = receipt.logs[0];
        const createEventAbi = IdentityManager.abi.filter(
          obj => obj.type === 'event' && obj.name === 'IdentityCreated'
        )[0];
        this.id = decodeEvent(createEventAbi, log.data, log.topics).identity;
        this.mnid = encode({ network: this.network.id, address: this.id });
        this.initTransactionSigner(IdentityManagerAdress);
        // TODO add address?
        const baseDdo = {
          '@context': 'http://schema.org',
          '@type': 'Person',
          publicKey: this.deviceKeys.publicKey
        };
        const ddo = Object.assign(baseDdo, initDdo);
        return this.writeDDO(ddo);
      })
      .then(this.ethjs.getTransactionReceipt.bind(this.ethjs))
      .then(receipt => {
        // .. receipt
        this.initialized = true;
        return;
      });
  }

  sign(payload) {
    const hash = SECP256K1Client.createHash(payload);
    return SECP256K1Client.signHash(hash, this.privateKey);
  }

  addProfileKey(key, value) {
    this.info[key] = value;
  }

  getDDO() {
    return this.registry(this.mnid);
  }

  writeDDO(newDdo) {
    const Registry = Contract(abi).at(this.network.registry);
    return this.getDDO()
      .then(ddo => {
        ddo = Object.assign(ddo || {}, newDdo);
        return new Promise((resolve, reject) => {
          this.ipfs.add(Buffer.from(JSON.stringify(ddo)), (err, result) => {
            if (err) reject(new Error(err));
            resolve(result);
          });
        });
      })
      .then(res => {
        const hash = res[0].hash;
        const hexhash = new Buffer(decode(hash)).toString('hex');
        // removes Qm from ipfs hash, which specifies length and hash
        const hashArg = `0x${hexhash.slice(4)}`;
        const key = 'uPortProfileIPFS1220';
        return Registry.set(key, this.id, hashArg);
      })
      .then(this.consume.bind(this));
  }

  signRawTx(unsignedRawTx) {
    return new Promise((resolve, reject) => {
      this.transactionSigner.signRawTx(unsignedRawTx, (err, rawTx) => {
        if (err) reject(err);
        resolve(rawTx);
      });
    });
  }

  shareRequestHandler(uri) {
    const params = getUrlParams(uri);
    // A shareReq in a token
    const token = decodeToken(params.requestToken).payload;
    const verified = filterCredentials(
      this.credentials,
      intersection(this.credentials, token.requested)
    );
    const req = params.requestToken;
    const info = intersection(this.info, token.requested).reduce(
      (infoReq, key) => {
        infoReq[key] = this.info[key];
        return infoReq;
      },
      {}
    );
    const payload = {
      ...info,
      iss: this.address,
      iat: new Date().getTime(),
      verified,
      type: 'shareReq',
      req
    };
    const response = this.signer(payload);

    if (this.network) {
      return this.verifyJWT(params.requestToken).then(() =>
        this.responseHandler(response, token.callbackUrl)
      );
    }

    return this.responseHandler(response, token.callbackUrl);
  }

  simpleRequestHandler(uri) {
    // A simple request
    const params = getUrlParams(uri);
    const response = this.signer({
      iss: this.address,
      iat: new Date().getTime(),
      address: this.address
    });
    return this.responseHandler(response, params.callback_url);
  }

  transactionRequestHandler(uri) {
    const params = getUrlParams(uri);
    const to = uri.match(/0[xX][0-9a-fA-F]+/g)[0];
    const from = this.deviceKeys.address;
    const data =
      params.bytecode || params.function ? funcToData(params.function) : '0x'; //TODO whats the proper null value?
    const value = params.value || 0;

    let nonce, gasPrice, gas, txObj;

    return this.ethjs
      .getTransactionCount(this.deviceKeys.address, 'pending')
      .then(res => {
        nonce = res;
        return params.gasPrice ? params.gasPrice : this.ethjs.gasPrice();
      })
      .then(res => {
        gasPrice = res;
        txObj = {
          to,
          value: new BN(value),
          data,
          gasPrice,
          nonce,
          from,
          gasLimit: 300000
        }; // temp gas val
        const tx = new Transaction(txObj);
        const unsignedRawTx = bufferToHex(tx.serialize());
        tx.sign(new Buffer(this.deviceKeys.privateKey.slice(2), 'hex')); // TODO remove redundant, get hash from above, and not actual hash when mocked since not IM

        if (this.ethjs) {
          return this.signRawTx(unsignedRawTx)
            .then(rawTx => {
              // TODO remove redudant signing to get actuall tx data for gas estimate, doing this for now since tx data changed in eth-signer
              const txEstimate = new Transaction(new Buffer(rawTx, 'hex'));
              const estimateTxObj = {
                data: txEstimate.data.toString('hex'),
                to: txEstimate.to.toString('hex'),
                from: txEstimate.from.toString('hex')
              };
              return this.ethjs.estimateGas(estimateTxObj);
            })
            .then(res => {
              txObj.gasLimit = params.gas
                ? params.gas
                : res.mul(new BN(20, 10)).div(new BN(19, 10)); // gas buffer
              const txWithGas = new Transaction(txObj);
              const unsignedRawTxWithGas = bufferToHex(txWithGas.serialize());
              return this.signRawTx(unsignedRawTxWithGas);
            })
            .then(rawTx => {
              return this.ethjs.sendRawTransaction(rawTx);
            })
            .then(txHash => {
              return this.responseHandler(txHash, params.callback_url);
            });
        } else {
          const txHash = bufferToHex(tx.hash(true));
          return this.responseHandler(txHash, params.callback_url);
        }
      });
  }

  addAttestationRequestHandler(uri) {
    const params = getUrlParams(uri);
    const attestations = Array.isArray(params.attestations)
      ? params.attestations
      : [params.attestations];

    for (let jwt in attestations) {
      jwt = attestations[jwt];
      const json = decodeToken(jwt).payload;
      const key = Object.keys(json.claim)[0];

      if (this.network) {
        this.verifyJWT(jwt)
          .then(() => {
            this.credentials[key]
              ? this.credentials[key].append({ jwt, json })
              : (this.credentials[key] = [{ jwt, json }]);
          })
          .catch(console.log);
      }
      // redundant
      this.credentials[key]
        ? this.credentials[key].append({ jwt, json })
        : (this.credentials[key] = [{ jwt, json }]);
    }
    // TODO standard response?
  }

  consume(uri) {
    if (isShareRequest(uri)) return this.shareRequestHandler(uri);
    if (isSimpleRequest(uri)) return this.simpleRequestHandler(uri);
    if (isTransactionRequest(uri)) return this.transactionRequestHandler(uri);
    if (isAddAttestationRequest(uri))
      return this.addAttestationRequestHandler(uri);
    return Promise.reject(new Error('Invalid URI Passed'));
  }
}

export default {
  UPortClient,
  serialize,
  deserialize,
  networks,
  genKeyPair,
  deploy
};
