import IpfsApi from 'ipfs-api';

const ipfs = IpfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default async buffer => {
  let result;

  try {
    result = await ipfs.add(buffer);
    return Promise.resolve(result[0].hash);
  } catch (error) {
    return Promise.reject(error);
  }
};
