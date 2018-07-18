import { Connect, SimpleSigner } from 'uport-connect';

export let uport = new Connect('Votoo', {
  clientId: '2oq2UhRb9k1TuxTD5zoxeYEqURthhHSbKrT',
  network: 'rinkeby',
  signer: SimpleSigner(process.env.DAPP_PRIV_KEY)
});

export const web3 = uport.getWeb3();
