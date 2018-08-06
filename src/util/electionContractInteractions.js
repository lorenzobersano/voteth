import Web3 from 'web3';
import { uport } from './connectors';
import Contract from 'truffle-contract';

import electionArtifact from './../../build/contracts/Election.json';
import electionRegistryArtifact from './../../electionRegistryAbi/ElectionRegistry.json';

import deployedAddresses from './electionRegistryAddress.json';

export let electionAddress;
let electionInstance, web3Provider, ElectionRegistry, ElectionEventWatcher;
const Election = Contract(electionArtifact);

if (typeof web3 !== 'undefined') {
  web3Provider = web3.currentProvider;

  web3 = new Web3(web3Provider);

  ElectionRegistry = web3.eth.contract(electionRegistryArtifact.abi);
  Election.setProvider(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  // web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
  // alert('Pls install metamask!');
}

const initializeElectionAddressAndInstance = async backendAddress => {
  electionAddress = backendAddress;

  try {
    electionInstance = await Election.at(electionAddress);
  } catch (error) {
    console.log(error);
  }

  ElectionEventWatcher = web3.eth
    .contract(electionArtifact.abi)
    .at(electionAddress);

  return Promise.resolve();
};

export const getElectionCurrentInstance = () => {
  return new Promise((resolve, reject) => {
    if (deployedAddresses.ElectionRegistry !== '') {
      const instance = ElectionRegistry.at(deployedAddresses.ElectionRegistry);
      instance.backendContract(async (err, backendContract) => {
        if (err) reject(err);

        if (electionAddress !== backendContract) {
          electionAddress = backendContract;

          try {
            electionInstance = await Election.at(electionAddress);
          } catch (error) {
            reject(error);
          }

          ElectionEventWatcher = web3.eth
            .contract(electionArtifact.abi)
            .at(electionAddress);
        }

        resolve(backendContract);
      });
    }
    // else {
    //   ElectionRegistry.new(
    //     {
    //       from: web3.eth.accounts[0],
    //       data: electionRegistryArtifact.bytecode
    //     },
    //     (err, electionRegistryInstance) => {
    //       if (err) reject(err);

    //       if (electionRegistryInstance.address) {
    //         console.log(electionRegistryInstance.address); // the contract address

    //         electionRegistryInstance.changeBackend(
    //           '0x73d25ab57ac4dc5a1ffe5c6140e172f4f9c7f4d1',
    //           {
    //             from: web3.eth.accounts[0]
    //           },
    //           (err, res) => {
    //             if (err) reject(err);
    //             resolve();
    //           }
    //         );
    //       }
    //     }
    //   );
    // }
  });
};

export const toggleCircuitBreaker = sender => {
  return new Promise(async (resolve, reject) => {
    try {
      await electionInstance.toggleCircuitBreaker({ from: sender });

      const circuitBreakerToggledEvent = ElectionEventWatcher.CircuitBreakerToggled(
        {},
        { fromBlock: 'latest', toBlock: 'latest' }
      );

      circuitBreakerToggledEvent.watch((err, res) => {
        if (err) reject(err);

        circuitBreakerToggledEvent.stopWatching();
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const checkIfStopped = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await electionInstance.stopped();

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export const changeBackend = (newBackendAddress, sender) => {
  return new Promise((resolve, reject) => {
    const instance = ElectionRegistry.at(deployedAddresses.ElectionRegistry);
    instance.changeBackend(
      newBackendAddress,
      { from: sender },
      async (err, result) => {
        if (err) reject(err);

        const res = await toggleCircuitBreaker(sender);

        console.log(res);

        await initializeElectionAddressAndInstance(newBackendAddress);

        resolve(result);
      }
    );
  });
};

export const getElectionAdminRights = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const owner = await electionInstance.owner();

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
      await electionInstance.addCandidate(
        picHash,
        name,
        party,
        politicalProgram,
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

export const getCandidateAt = pos => {
  return new Promise(async (resolve, reject) => {
    try {
      const candidate = await electionInstance.getCandidateAt(pos);

      resolve(candidate);
    } catch (e) {
      reject(e);
    }
  });
};

export const getVotesForCandidate = candidate => {
  return new Promise(async (resolve, reject) => {
    try {
      const votes = await electionInstance.getVotesForCandidate(candidate);

      resolve(votes.toNumber());
    } catch (e) {
      reject(e);
    }
  });
};

export const getNumberOfCandidates = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const numOfCandidates = await electionInstance.getNumberOfCandidates();

      resolve(numOfCandidates);
    } catch (e) {
      reject(e);
    }
  });
};

export const getVerificationRequestAt = (pos, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      const verificationRequest = await electionInstance.getVerificationRequestAt(
        pos,
        {
          from: sender
        }
      );

      resolve(verificationRequest);
    } catch (e) {
      reject(e);
    }
  });
};

export const getNumberOfVerificationRequests = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const numOfVerificationRequests = await electionInstance.getNumberOfVerificationRequests();

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
      const instance = uport.contract(electionArtifact.abi).at(electionAddress);
      await instance.requestVerification(
        requesterName,
        votingDocumentIPFSHash,
        {
          from: sender
        }
      );

      const verificationRequestedEvent = ElectionEventWatcher.VerificationRequested(
        { _requester: sender },
        { fromBlock: 'latest', toBlock: 'latest' }
      );

      verificationRequestedEvent.watch((err, res) => {
        if (err) reject(err);
        verificationRequestedEvent.stopWatching();
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const removeVerificationRequestAt = (pos, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await electionInstance.removeVerificationRequestAt(pos, {
        from: sender
      });

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export const checkIfUserHasRequestedVerification = sender => {
  return new Promise(async (resolve, reject) => {
    try {
      const numOfVerificationRequests = await electionInstance.getNumberOfVerificationRequests();

      for (let i = 0; i < numOfVerificationRequests.toNumber(); i++) {
        const verificationRequest = await electionInstance.getVerificationRequestAt(
          i
        );

        verificationRequest[0] == sender && resolve(true);
      }

      resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};

export const getVerificationState = sender => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await electionInstance.verifiedVoter(sender);

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export const checkIfVoterHasCommittedVote = sender => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await electionInstance.voterHasCommittedVote(sender);

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export const checkIfVoterHasRevealedVote = sender => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await electionInstance.voterHasRevealedVote(sender);

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export const commitVote = (vote, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = uport.contract(electionArtifact.abi).at(electionAddress);
      await instance.commitVote(vote, {
        from: sender
      });

      const voteCommittedEvent = ElectionEventWatcher.VoteCommitted(
        { _voter: sender },
        { fromBlock: 'latest', toBlock: 'latest' }
      );

      voteCommittedEvent.watch((err, res) => {
        if (err) reject(err);
        voteCommittedEvent.stopWatching();
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const revealVote = (vote, voteHash, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = uport.contract(electionArtifact.abi).at(electionAddress);
      await instance.revealVote(vote, voteHash, {
        from: sender
      });

      const voteRevealedEvent = ElectionEventWatcher.VoteRevealed(
        { _voter: sender },
        { fromBlock: 'latest', toBlock: 'latest' }
      );

      voteRevealedEvent.watch((err, res) => {
        if (err) reject(err);
        voteRevealedEvent.stopWatching();
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const verifyVoter = (voter, positionInRequestersArray, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      await electionInstance.verifyVoter(voter, positionInRequestersArray, {
        from: sender
      });

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

    try {
      await electionInstance.setElectionTimeRange(startTime, endTime, {
        from: sender
      });

      const timeRangeSetEvent = ElectionEventWatcher.TimeRangeSet(
        { _owner: sender },
        { fromBlock: 'latest', toBlock: 'latest' }
      );

      timeRangeSetEvent.watch((err, res) => {
        if (err) reject(err);
        timeRangeSetEvent.stopWatching();
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const getElectionTimeRange = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await electionInstance.getElectionTimeRange();

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
