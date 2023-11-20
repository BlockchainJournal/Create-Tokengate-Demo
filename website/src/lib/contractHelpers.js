const {join} = require('path');
const fs = require('fs');
const { ethers, JsonRpcProvider, FeeData } = require("ethers")

// Define the path to your .env file
const envFilePath = join(__dirname, '../.env'); // Replace '.env' with the actual filename if it's different
const dotenv = require('dotenv');



//const stream = require('stream');
const { pipeline } = require('stream');
dotenv.config({ debug: true,path: envFilePath })
const { TextDecoder, TextEncoder } = require('util');
const Moralis = require('moralis').default ;

if(!process.env.INFURA_API_KEY) throw new Error('Required environment variable INFURA_API_KEY is missing');
if(!process.env.SEPOLIA_PRIVATE_KEY) throw new Error('Required environment variable SEPOLIA_PRIVATE_KEY is missing');
if(!process.env.NFT_STORAGE_KEY) throw new Error('Required environment variable NFT_STORAGE_KEY is missing');
if(!process.env.MORAIS_API_KEY) throw new Error('Required environment variable MORAIS_API_KEY is missing');
if(!process.env.PINATA_API_KEY) throw new Error('Required environment variable PINATA_API_KEY is missing');
if(!process.env.PINATA_SECRET_API_KEY) throw new Error('Required environment variable PINATA_SECRET_API_KEY is missing');
const providerUrl =  `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`


const abiFilePath = join(__dirname, '../data', 'dilty-abi.json');
const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
const provider = new JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const gatewayUrl = 'https://gateway.pinata.cloud/ipfs/';

async function getNFTImageUrlFromTokenUri(tokeUri) {
    const cid = tokeUri.replace('ipfs://','');
    const response = await fetch(`${gatewayUrl}${cid}`);
    const json = await response.text();
    const obj = JSON.parse(json);
    return obj.image;
}


async function getNFTImageUrl(tokenCid) {
    if(tokenCid.includes('https://')){
        const result = await fetch(tokenCid);
        const obj = await result.json();

        return `${gatewayUrl}${obj.image.replace('ipfs://','')}`;
    }
    return `${gatewayUrl}${tokenCid.replace('ipfs://', '')}`
}

async function fetchPngUrlFromContract(tokenId) {
    const addresses = await getContractAndOwnerAddresses();
    const contractAddress = addresses.diltyAddress;

    const contractAbi = require(abiFilePath);
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, wallet);
    // Get the token URI for the NFT.
    const tokenUri = await contractInstance.tokenURI(tokenId);
    // Check if the tokenURI is an IPFS URI.
   const url=  await getNFTImageUrl(tokenUri);
   return url;
}

async function getNextTokenId() {
    const addresses = await getContractAndOwnerAddresses();
    const contractAddress = addresses.diltyAddress;
    const contractAbi = require(abiFilePath);
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, wallet);
    // Get the token URI for the NFT.
    const nextTokenId = await contractInstance.getNextTokenId();
    return nextTokenId;
}

async function getTokenData() {
    const directoryPath = join(__dirname,'../contracts/');
    const filePath = join(directoryPath, 'tokenuri-data.json');
    // Write the JSON data to the file
    let rslt;

    try {
        rslt = fs.readFileSync(filePath);
    } catch (e) {
        console.error('Error reading or parsing the file:', e);
    }
    const jsonObject = JSON.parse(rslt);
    const ipfsUrl =  await getNFTImageUrl(jsonObject.cid)
    //const ipfsUrl =  jsonObject.url.replace('/metadata.json','');
    const ipfsCid =  jsonObject.cid;
    return {ipfsUrl, ipfsCid}
}
async function getContractAndOwnerAddresses(){
    const filePath = join(__dirname, '../data', 'dilty-addresses.json');
    let addresses;

    try {
        if (fs.existsSync(filePath)) {
            addresses = JSON.parse(fs.readFileSync(filePath));
        } else {
            console.error(`File ${filePath} does not exist.`);
        }
    } catch (err) {
        console.error('Error reading or parsing the file:', err);
    }

    return addresses;
}

async function getEnvVars(){
    join(__dirname, '../.env')
    return process.env;
}

/**
 *
 * @param userAddress, the address of the user to check
 * @returns {Promise<*|number>} that is the tokenId or -1 if not found
 */
async function verifyTokenOwnership(userAddress){
    const contractAddresses = await getContractAndOwnerAddresses()
    const contractAbi = require(abiFilePath);
    const contractInstance = new ethers.Contract(contractAddresses.diltyAddress, contractAbi, wallet);
    try {
        const tokenId= await contractInstance.getAddressTokenId(userAddress);
        return tokenId;
    } catch (e) {
        return -1;
    }
}

async function mintAndTransfer(recipientAddress) {
    const addresses = await getContractAndOwnerAddresses();
    const contractAddress = addresses.diltyAddress;
    const contractAbi = require(abiFilePath);
    const obj = await getTokenData();
    const tokenUri = obj.ipfsUrl

    const contractInstance = new ethers.Contract(contractAddress, contractAbi, wallet);
    //DO THE MINT
    try {
        // Call the mint function with a token URI
        const result = await contractInstance.mint(tokenUri);
        console.log('Mint result:', result);
    } catch (error) {
        console.error('Error calling the mint function:', error);
    }
    //DO THE TRANSFER
    try {
        // Call the transfer function with a token URI
        const result = await contractInstance.transfer(recipientAddress);
        console.log('Transfer result:', result);
        return result;
    } catch (error) {
        console.error('Error calling the Transfer function:', error);
    }

}

module.exports = {
    verifyTokenOwnership,
    mintAndTransfer,
    getEnvVars,
    fetchPngUrlFromContract,
    getNFTImageUrl,
    getNextTokenId,
    getNFTImageUrlFromTokenUri,
    getContractAndOwnerAddresses}
