import Web3 from 'web3';
import Contract from 'truffle-contract';

import electionArtifact from './../../build/contracts/Election.json';

const Election = Contract(electionArtifact);
let web3Provider;

if (typeof web3 !== 'undefined') {
  web3Provider = web3.currentProvider;
} else {
  // set the provider you want from Web3.providers
  web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
}

web3 = new Web3(web3Provider);

Election.setProvider(web3.currentProvider);

let owner;

export const getElectionAdminRights = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      owner = await instance.getOwner();

      web3.eth.accounts.length > 0 && web3.eth.accounts[0] == owner
        ? resolve(owner)
        : reject();
    } catch (e) {
      reject(e);
    }
  });
};

export const addCandidate = (picHash, name, party, politicalProgram) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      await instance.addCandidate(picHash, name, party, politicalProgram, {
        from: owner
      });

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const setElectionStartTime = startTime => {
  return new Promise(async (resolve, reject) => {});
};
