import Contract from 'truffle-contract';
import { IdentityManager as _IdentityManager } from 'uport-identity';
import registryArtifact from 'uport-registry';
const identityManagerArtifact = _IdentityManager.v1;
import EthJS from 'ethjs-query';
import HttpProvider from 'ethjs-provider-http';
import SignerProvider from 'ethjs-provider-signer';
import { sign } from 'ethjs-signer';

const Registry = Contract(registryArtifact);
const IdentityManager = Contract(identityManagerArtifact);

const deploy = (
  network,
  { from, gas, gasPrice, IdentityManagerArgs = {} } = {},
  privKey
) => {
  let provider;

  if (privKey) {
    provider = new SignerProvider(network, {
      signTransaction: (rawTx, cb) => cb(null, sign(rawTx, privKey))
    });
  } else {
    provider =
      network || typeof network === 'string'
        ? new HttpProvider(network)
        : network;
  }

  Registry.setProvider(provider);
  IdentityManager.setProvider(provider);
  const eth = new EthJS(provider);

  const userTimeLock = IdentityManagerArgs.userTimeLock || 50;
  const adminTimeLock = IdentityManagerArgs.adminTimeLock || 200;
  const adminRate = IdentityManagerArgs.adminRate || 50;
  gas = gas || 3000000;

  let resObj = {};
  let address;

  return eth
    .coinbase()
    .then(res => {
      from = from || res;
      return gasPrice ? gasPrice : eth.gasPrice();
    })
    .then(res => {
      gasPrice = res;
      const fakePrevVersion = 0; // Registry contract constructor expects a previous version
      return Registry.new(fakePrevVersion, { from, gas });
    })
    .then(instance => {
      resObj.Registry = instance.address;
      return IdentityManager.new(userTimeLock, adminTimeLock, adminRate, {
        from,
        gas
      });
    })
    .then(instance => {
      resObj.IdentityManager = instance.address;
      return resObj;
    })
    .catch(console.log);
};

export default deploy;
