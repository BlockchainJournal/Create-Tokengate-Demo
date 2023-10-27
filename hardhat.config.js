require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const getErrorMessage = (envVarName) => {
    return `Required environment variable ${envVarName} is missing`
}

if (!process.env.INFURA_API_KEY) throw new Error(getErrorMessage('INFURA_API_KEY'));
// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and replace "KEY" with it
const INFURA_API_KEY = process.env.INFURA_API_KEY;

if (!process.env.SEPOLIA_PRIVATE_KEY) throw new Error(getErrorMessage('SEPOLIA_PRIVATE_KEY'));
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY

if (!process.env.NFT_STORAGE_KEY) throw new Error(getErrorMessage('NFT_STORAGE_KEY'));
const NFT_STORAGE_KEY = process.env.NFT_STORAGE

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  nftStorageKey: `${NFT_STORAGE_KEY}`,
  infuraApiKey: `${INFURA_API_KEY}`,
  infuraUrl: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    solidity: "0.8.20",
    networks: {
      sepolia: {
        url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
        accounts: [SEPOLIA_PRIVATE_KEY]
      }
    }
  };
