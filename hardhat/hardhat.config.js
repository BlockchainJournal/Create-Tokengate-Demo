require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("./tasks/diltyUploadPngToIpfsPinata");
const { AlchemyProvider } = require('ethers');

const getErrorMessage = (envVarName) => {
    return `Required environment variable ${envVarName} is missing`
}

if (!process.env.INFURA_API_KEY) throw new Error(getErrorMessage('INFURA_API_KEY'));
// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and replace "KEY" with it
const INFURA_API_KEY = process.env.INFURA_API_KEY;

if (!process.env.SEPOLIA_PRIVATE_KEY) throw new Error(getErrorMessage('SEPOLIA_PRIVATE_KEY'));
if (!process.env.ALCHEMY_API_KEY)throw new Error(getErrorMessage('ALCHEMY_API_KEY'));
//if (!process.env.NFT_STORAGE_KEY) throw new Error(getErrorMessage('NFT_STORAGE_KEY'));
//if (!process.env.ADMIN_PRIVATE_KEY) throw new Error(getErrorMessage('ADMIN_PRIVATE_KEY'));
//if (!process.env.ADMIN_PRIVATE_KEY) throw new Error(getErrorMessage('ADMIN_PRIVATE_KEY'));
if (!process.env.PINATA_API_KEY) throw new Error(getErrorMessage('PINATA_API_KEY'));
if (!process.env.PINATA_SECRET_API_KEY) throw new Error(getErrorMessage('PINATA_SECRET_API_KEY'));


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  privateKey: `${process.env.SEPOLIA_PRIVATE_KEY}`,
  //nftStorageKey: `${process.env.NFT_STORAGE_KEY}`,
  infuraApiKey: `${process.env.INFURA_API_KEY}`,
  infuraUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
  solidity: "0.8.20",
  tasks: {
    params: {
      use: "@nomiclabs/hardhat-params/tasks/params",
    },
  },
  networks: {
    //alchemy: {
      //url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
     // },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
      provider: new AlchemyProvider('sepolia', process.env.ALCHEMY_API_KEY),
      },
    hardhat: {
      runner: 'HardhatNetworkRunner',
      //nftStorageKey: `${process.env.NFT_STORAGE_KEY}`,
      //adminPrivateKey: `${process.env.ADMIN_PRIVATE_KEY}`,
      pinataApiKey: `${process.env.PINATA_API_KEY}`,
      pinataSecretApiKey: `${process.env.PINATA_SECRET_API_KEY}`,
      }
    }
  };
