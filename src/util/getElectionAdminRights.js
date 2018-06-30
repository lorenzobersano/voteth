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

export const getElectionAdminRights = () => {
  return new Promise((resolve, reject) => {
    Election.deployed()
      .then(instance => {
        console.log(instance);

        return instance.getOwner();
      })
      .then(owner => {
        console.log(owner);
        web3.eth.accounts.length > 0 && web3.eth.accounts[0] == owner
          ? resolve(owner)
          : reject();
      })
      .catch(() => reject());
  });
};
