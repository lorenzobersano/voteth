import Contract from 'truffle-contract';

import electionsListArtifact from './../../build/contracts/ElectionsList.json';
import electionRegistryArtifact from './../../electionRegistryAbi/ElectionRegistry.json';
import electionArtifact from './../../build/contracts/Election.json';

let electionInstance,
  electionRegistryInstance,
  electionsListInstance,
  sender,
  ElectionRegistry;

const ElectionsList = Contract(electionsListArtifact);
const Election = Contract(electionArtifact);

if (typeof web3 !== 'undefined') {
  ElectionsList.setProvider(web3.currentProvider);
  ElectionRegistry = web3.eth.contract(electionRegistryArtifact.abi);
  Election.setProvider(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  // web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
  // alert('Pls install metamask!');
}

// export const toggleCircuitBreaker = sender => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       await electionInstance.toggleCircuitBreaker({ from: sender });

//       const circuitBreakerToggledEvent = ElectionEventWatcher.CircuitBreakerToggled(
//         {},
//         { fromBlock: 'latest', toBlock: 'latest' }
//       );

//       circuitBreakerToggledEvent.watch((err, res) => {
//         if (err) reject(err);

//         circuitBreakerToggledEvent.stopWatching();
//         resolve(res);
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

// export const checkIfStopped = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const result = await electionInstance.stopped();

//       resolve(result);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

export const getNumberOfElections = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await ElectionsList.deployed();
      const numOfElections = await instance.getNumOfElections();

      resolve(numOfElections);
    } catch (e) {
      reject(e);
    }
  });
};

export const getElectionAt = pos => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await ElectionsList.deployed();
      const election = await instance.elections(pos);

      resolve(election);
    } catch (e) {
      reject(e);
    }
  });
};

export const removeElectionAt = (pos, sender) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await ElectionsList.deployed();
      await instance.removeElectionAt(pos, { from: sender });

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const deployElectionContract = () => {
  return new Promise(async (resolve, reject) => {
    try {
      sender = web3.eth.accounts[0];

      electionInstance = await Election.new({ from: sender });
      Election.link('strings', '0xdb348eac1990e5d2e844a10d56921a5e9ef17df5');

      resolve(electionInstance);
    } catch (e) {
      reject(e);
    }
  });
};

export const deployElectionRegistryContract = () => {
  return new Promise(async (resolve, reject) => {
    try {
      ElectionRegistry.new(
        {
          from: sender,
          data: electionRegistryArtifact.bytecode
        },
        (err, electionRegistryResult) => {
          if (err) reject(err);

          if (electionRegistryResult.address) {
            electionRegistryInstance = electionRegistryResult;

            resolve(electionRegistryInstance);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

export const setBackend = () => {
  return new Promise((resolve, reject) => {
    electionRegistryInstance.changeBackend(
      electionInstance.address,
      { from: sender },
      async (err, result) => {
        if (err) reject(err);

        if (result !== false) {
          const backendChangedEvent = electionRegistryInstance.BackendChanged(
            { newBackend: electionInstance.address },
            { fromBlock: 'latest', toBlock: 'latest' }
          );

          backendChangedEvent.watch((err, res) => {
            if (err) reject(err);

            backendChangedEvent.stopWatching();
            resolve(res);
          });
        } else resolve(result);
      }
    );
  });
};

export const createElection = (name, description) => {
  return new Promise(async (resolve, reject) => {
    try {
      const electionsListInstance = await ElectionsList.deployed();

      const result = await electionsListInstance.createElection(
        name,
        description,
        electionRegistryInstance.address,
        { from: sender }
      );

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
