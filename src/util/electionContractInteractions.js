import Web3 from 'web3';
import { uport } from './connectors';
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
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      const owner = await instance.owner();

      web3.eth.accounts.length > 0 && web3.eth.accounts[0] == owner
        ? resolve(owner)
        : reject();
    } catch (e) {
      reject(e);
    }
  });
};

export const addCandidate = (
  picHash,
  name,
  party,
  politicalProgram,
  sender
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      await instance.addCandidate(picHash, name, party, politicalProgram, {
        from: sender
      });

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const getCandidateAt = pos => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      const candidate = await instance.getCandidateAt(pos);

      resolve(candidate);
    } catch (e) {
      reject(e);
    }
  });
};

export const getNumberOfCandidates = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      const numOfCandidates = await instance.getNumberOfCandidates();

      resolve(numOfCandidates);
    } catch (e) {
      reject(e);
    }
  });
};

export const getVerificationRequestAt = (pos, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      const verificationRequest = await instance.getVerificationRequestAt(pos, {
        from: sender
      });

      resolve(verificationRequest);
    } catch (e) {
      reject(e);
    }
  });
};

export const getNumberOfVerificationRequests = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      const numOfVerificationRequests = await instance.getNumberOfVerificationRequests();

      resolve(numOfVerificationRequests);
    } catch (e) {
      reject(e);
    }
  });
};

export const requestVerification = (
  requesterName,
  votingDocumentIPFSHash,
  sender
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = uport
        .contract(electionArtifact.abi)
        .at('0x0abad1df09f13e158ee4cc12f9f36c2e52097f1d');
      await instance.requestVerification(
        requesterName,
        votingDocumentIPFSHash,
        {
          from: sender
        }
      );

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const removeVerificationRequestAt = (pos, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      const result = await instance.removeVerificationRequestAt(pos, {
        from: sender
      });

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export const getVerificationState = sender => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      const result = await instance.getVerificationState({ from: sender });

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export const commitVote = (vote, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      await instance.commitVote(vote, { from: sender });

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const verifyVoter = (voter, expirationDate, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await Election.deployed();
      await instance.verifyVoter(voter, expirationDate, { from: sender });

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const setElectionTimeRange = (startTime, endTime, sender) => {
  return new Promise(async (resolve, reject) => {
    if (endTime < startTime)
      return reject('End time must be greater than start time!');

    let instance;

    try {
      instance = await Election.deployed();
      await instance.setElectionTimeRange(startTime, endTime, { from: sender });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
