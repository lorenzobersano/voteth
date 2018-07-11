import { UPortClient } from '../index.js';
import { deploy } from '../index.js';
import EthJS from 'ethjs-query';
import HttpProvider from 'ethjs-provider-http';
import { decodeToken } from 'jsontokens';

const rpcUrl = 'http://127.0.0.1:8545';
const eth = new EthJS(new HttpProvider(rpcUrl));
let uportClient;
let address;

const createuPortClient = () => {
  return deploy(rpcUrl).then(res => {
    const config = {
      network: {
        id: '0x5777',
        rpcUrl,
        registry: res.Registry,
        identityManager: res.IdentityManager
      },
      deviceKeys: deviceKey
    };
    uportClient = new UPortClient(config);
    uportClient.initKeys();
    return eth
      .coinbase()
      .then(addr => {
        // Fund device key Transaction
        address = addr;
        const fundTx = {
          to: uportClient.deviceKeys.address,
          value: 0.02 * 1.0e18,
          from: address,
          data: '0x'
        };
        return eth.sendTransaction(fundTx);
      })
      .then(txHash => {
        console.log('Funded device key');
        //  Following commented out section can be used to create additional data for an app identity
        //   return uportClient.appDDO('myapp', 'is cool app', 'dapp.com', './myimage.png')
        // }).then(ddo => {
        //   console.log('ddo created')
        //   return uportClient.initializeIdentity(ddo)
        return uportClient.initializeIdentity();
      })
      .then(res => {
        console.log('Identity Created');
        return uportClient;
      });
  });
};

createuPortClient()
  .then(client => {
    console.log(client);
    // Create a request
    // const uri =
    const value = 0.01 * 1.0e18;
    const fundTx = { to: client.id, value, from: address, data: '0x' };
    return eth
      .sendTransaction(fundTx)
      .then(txHash => {
        console.log(txHash);
        console.log('Funded proxy');
        const uri = `me.uport:0xf17f52151EbEF6C7334FAD080c5704D77216b732?value=${value}`;
        // Send to client
        return client.consume(uri);
      })
      .then(res => {
        console.log(res);
      });
    // return client.consume(uri)
  })
  .then(res => {
    // Handle Response
  })
  .catch(console.log);
