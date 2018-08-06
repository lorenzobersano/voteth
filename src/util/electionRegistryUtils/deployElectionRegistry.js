const argv = require('yargs').argv;
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const jsonfile = require('jsonfile');
var fs = require('fs');

require('dotenv').config();

const electionRegistryArtifact = require('./../../../electionRegistryAbi/ElectionRegistry.json');
const deployedRegistry = require('./electionRegistryAddress.json');

const command = argv._[0];
const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
);
const web3 = new Web3(provider);
const ElectionRegistry = web3.eth.contract(electionRegistryArtifact.abi);
let coinbase;

web3.eth.getCoinbase((err, _coinbase) => {
  if (err) {
    console.log(err);
    process.exit();
  }

  coinbase = _coinbase;

  switch (command) {
    case 'deployRegistry':
      ElectionRegistry.new(
        {
          from: coinbase,
          data: electionRegistryArtifact.bytecode
        },
        (err, electionRegistryInstance) => {
          if (err) {
            console.log(err);
            process.exit();
          }

          if (electionRegistryInstance.address) {
            const file =
              './src/util/electionRegistryUtils/electionRegistryAddress.json';
            const obj = {
              address: electionRegistryInstance.address
            };

            jsonfile.writeFileSync(file, obj, { spaces: 2 });

            console.log(
              'Election Registry address was correctly written to electionRegistryAddress.json'
            ); // the contract address

            process.exit();
          }
        }
      );

      break;
    case 'changeBackend':
      const electionRegistryInstance = ElectionRegistry.at(
        deployedRegistry.address
      );

      console.log(electionRegistryInstance);

      electionRegistryInstance.changeBackend(
        argv.newBackend,
        {
          from: coinbase
        },
        (err, res) => {
          if (err) {
            console.log(err);
            process.exit();
          }

          console.log('Backend successfully set!');

          process.exit();
        }
      );
      break;

    default:
      console.log('Invalid Command');
  }
});
