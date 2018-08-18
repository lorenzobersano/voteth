var Election = artifacts.require('./Election.sol');
var strings = artifacts.require('./strings.sol');
const ElectionsList = artifacts.require('./ElectionsList.sol');

module.exports = function(deployer, network) {
  if (network === 'rinkeby') deployer.deploy(ElectionsList);
  else {
    deployer.deploy(strings);
    deployer.link(strings, Election);
    deployer.deploy(Election);
    deployer.deploy(ElectionsList);
  }
};
