module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    rinkeby: {
      host: 'localhost',
      port: 7545,
      network_id: '4',
      from: '0xe3a259a2d2f06457f9f7ae4365e142cd58043fff',
      gas: 4612388 // Gas limit used for deploys
    }
  }
};
