<img src="./src/img/voteth.svg" width=30% alt='votΞ'/>

A pseudoanonymous voting ĐApp based on Ethereum, built for the ConsenSys Academy Developer Program.

## What does votΞ do?

votΞ lets anyone with a MetaMask account to create and manage elections stored on the Ethereum blockchain.

Since a vote must be tied with an identity, votΞ leverages the power of [uPort](https://uport.me), a Self Sovereign Identity solution built on Ethereum.
Anyone can check the candidates and the results of an election, but only verified uPort identities can participate to it.

## Why votΞ?

Since I'm really interested in eVoting and the possibilities that blockchain brings to the table, votΞ is an initial exploration of the topic.

Currently, given the transparent nature of blockchain, only pseudoanonimity is possible via the commit-reveal voting pattern, so for now votΞ implements this simple but effective pattern.

In the future votΞ will change in order to achieve more anonimity, maybe taking advantage of privacy solutions like [Enigma](https://enigma.co/).

## How to set it up

First of all `node_modules` need to be installed and smart contracts need to be compiled, so open your terminal and type `npm install`.
<br/>
Once it has finished run `truffle compile` to compile votΞ's smart contracts.
<br/>
Once they are compiled, smart contracts must be deployed to Rinkeby, you can find out how to do it in the next section.

Finally, run `npm start` in order to spin up a dev server.

## How to deploy your own votΞ instance

In order to deploy a new votΞ instance you have to use `truffle migrate --network rinkeby` which deploys to Rinkeby: make sure to have some testnet Ether in the deploying account (you can get it from [here](https://faucet.rinkeby.io/)) and paste its mnemonic in your .env file (create it in the root of the project), create an account on Infura and get your API key (keep it secret, copy it in your .env file).

## How to test contracts

In order to test the contracts, `ganache-cli` and `truffle` are needed: if you don't have them installed yet, run `npm i -g ganache-cli truffle` to install them globally on your machine.

Once they are installed open two instances of your terminal: in the first one run `ganache-cli`, in the other one run `truffle compile` to compile the Solidity contracts, then run `truffle migrate` to deploy the contracts to the local test simulated blockchain and finally run `truffle test` to run the JavaScript tests for the contracts.
