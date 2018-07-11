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
      port: 8545,
      network_id: '4',
      from: '0xb52b1221862df872a8f734d3bc04e7f6371aa729'
    }
  }
};
