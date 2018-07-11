import { Connect, SimpleSigner } from 'uport-connect';

export let uport = new Connect('Votoo', {
  clientId: '2oq2UhRb9k1TuxTD5zoxeYEqURthhHSbKrT',
  network: 'rinkeby',
  signer: SimpleSigner(process.env.DAPP_PRIV_KEY)
});

export let uportTestChain = new Connect('Votoo', {
  network_id: '0x5777',
  accountType: 'devicekey',
  clientId: '2oq2UhRb9k1TuxTD5zoxeYEqURthhHSbKrT',
  signer: SimpleSigner(process.env.DAPP_PRIV_KEY)
});

export const web3 = uport.getWeb3();
export const web3TestChain = uportTestChain.getWeb3();
