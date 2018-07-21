var Election = artifacts.require('./Election.sol');
var strings = artifacts.require('./strings.sol');

module.exports = function(deployer) {
  deployer.deploy(strings);
  deployer.link(strings, Election);
  deployer.deploy(Election);
};
