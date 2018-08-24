import IpfsApi from 'ipfs-api';
import bs58 from 'bs58';

const ipfs = IpfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export const ipfsHashToBytes32 = hash => {
  const h = bs58
    .decode(hash)
    .toString('hex')
    .replace(/^1220/, '');

  if (h.length != 64) {
    console.log('invalid ipfs format', hash, h);
    return null;
  }

  return '0x' + h;
};

export const bytes32ToIPFSHash = hashHex => {
  const buf = new Buffer(hashHex.replace(/^0x/, '1220'), 'hex');
  return bs58.encode(buf);
};

export const uploadToIPFS = buffer => {
  return new Promise(async (resolve, reject) => {
    let result;

    try {
      result = await ipfs.add(buffer);
      resolve(ipfsHashToBytes32(result[0].hash));
    } catch (error) {
      reject(error);
    }
  });
};

export const resolveIPFSHash = hash => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(`https://ipfs.io/ipfs/${bytes32ToIPFSHash(hash)}`);
    } catch (error) {
      reject(error);
    }
  });
};
