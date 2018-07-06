import IpfsApi from 'ipfs-api';

const ipfs = IpfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export const uploadToIPFS = buffer => {
  return new Promise(async (resolve, reject) => {
    let result;

    try {
      result = await ipfs.add(buffer);
      resolve(result[0].hash);
    } catch (error) {
      reject(error);
    }
  });
};

export const resolveIPFSHash = hash => {
  return new Promise(async (resolve, reject) => {
    try {
      const bufferFromIPFS = await ipfs.cat(`/ipfs/${hash}`);

      const resultBlob = new Blob([bufferFromIPFS]);
      const result = URL.createObjectURL(resultBlob);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
