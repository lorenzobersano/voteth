# voteth

A pseudoanonymous voting ĐApp based on Ethereum.

## How to set it up

Run ```npm start``` in order to spin up a dev server.

## How to test contracts

In order to test the contracts, ```ganache-cli``` and ```truffle``` are needed: ff you don't have them installed yet, run ```npm i -g ganache-cli truffle``` to install them globally on your machine.

Once they are installed open two instances of your terminal: in the first one run ```ganache-cli```, in the other one run ```truffle compile``` to compile the Solidity contracts, then run ```truffle migrate``` to deploy the contracts to the local test simulated blockchain and finally run ```truffle test``` to run the JavaScript tests for the contracts.
