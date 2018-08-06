# voteth

A pseudoanonymous voting ĐApp based on Ethereum.

## How to set it up

Run `npm start` in order to spin up a dev server.

## How to deploy your own Election

In order to deploy a new Election you have to:

1.  Deploy Election contract
    Use `truffle migrate --network rinkeby` which deploys to Rinkeby: make sure to have some testnet Ether in the deploying account (you can get it from [here](https://faucet.rinkeby.io/)) and paste its mnemonic in your .env file, create an account on Infura and get your API key (keep it secret, copy it in your .env file).
    Copy the Election address, you will need it in the next step.

2.  Deploy Election Registry contract
    I made a simple Node script to do this. To execute it open your terminal in the base folder of voteth and type
    ```Javascript
    node .\src\util\electionRegistryUtils\deployElectionRegistry.js deployRegistry
    ```
    When it's finished run
    ```Javascript
    node .\src\util\electionRegistryUtils\deployElectionRegistry.js changeBackend --newBackend yourElectionContractAddress
    ```

## How to test contracts

In order to test the contracts, `ganache-cli` and `truffle` are needed: if you don't have them installed yet, run `npm i -g ganache-cli truffle` to install them globally on your machine.

Once they are installed open two instances of your terminal: in the first one run `ganache-cli`, in the other one run `truffle compile` to compile the Solidity contracts, then run `truffle migrate` to deploy the contracts to the local test simulated blockchain and finally run `truffle test` to run the JavaScript tests for the contracts.
