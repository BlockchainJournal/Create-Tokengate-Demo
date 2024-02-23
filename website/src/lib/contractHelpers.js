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
const contractABI = require("../data/dilty-abi.json");
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
const ipfsProxyUrl = 'https://ipfs.io/ipfs/';
const gatewayUrl = 'ipfs://';

async function getNFTImageUrlFromTokenUri(tokeUri) {
    const cid = tokeUri.replace('ipfs://','');
    const response = await fetch(`${ipfsProxyUrl}${cid}`);
    const json = await response.text();
    const obj = JSON.parse(json);
    return obj.image;
}


async function getTokenUriJson(tokenId){
    const addresses = await getContractAndOwnerAddresses();
    const contractAddress = addresses.diltyAddress;
    const contractAbi = require(abiFilePath);
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, wallet);
    const tokenUri = await contractInstance.tokenURI(tokenId);
    const ipfsUri = 'https://ipfs.io/ipfs/';
    const response = await fetch(`${ipfsUri}${tokenUri.replace('ipfs://','')}`);
    return await response.json();
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
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    // Get the token URI for the NFT.
    const nextTokenId = await contract.getNextTokenId();
    return nextTokenId;
}

async function getTokenData() {
    const directoryPath = join(__dirname,'../data/');
    const filePath = join(directoryPath, 'dilty-ipfs.json');
    // Write the JSON data to the file
    let rslt;

    try {
        rslt = fs.readFileSync(filePath);
    } catch (e) {
        console.error('Error reading or parsing the file:', e);
    }
    const jsonObject = JSON.parse(rslt);
    //const ipfsUrl =  await getNFTImageUrl(jsonObject.metadataCid)
    //const ipfsUrl =  jsonObject.url.replace('/metadata.json','');
    //const ipfsCid =  jsonObject.metadataCid;
    //return {ipfsUrl, ipfsCid}
    return jsonObject;
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
async function getTokenId(userAddress){
    const contractAddresses = await getContractAndOwnerAddresses()
    const contractAbi = require(abiFilePath);
    ///const contractInstance = new ethers.Contract(contractAddresses.diltyAddress, contractAbi, wallet);
    const contract = new ethers.Contract(contractAddresses.diltyAddress, contractABI, provider);
    try {
        const tokenId= await contract.getAddressTokenId(userAddress);
        //const tokenId= await contractInstance.getAddressTokenId(userAddress);
        return Number(tokenId);
    } catch (e) {
        return -1;
    }
}

async function mintAndTransfer(recipientAddress) {
    const addresses = await getContractAndOwnerAddresses();
    const contractAddress = addresses.diltyAddress;
    const contractAbi = require(abiFilePath);
    const obj = await getTokenData();
    const tokenUri = `${gatewayUrl}${obj.metadataCid}`;
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, wallet);
    //DO THE MINT
    try {
        // Call the mint function with a token URI
        const result = await contractInstance.mint(tokenUri, recipientAddress);
        console.log('Mint result:', result);
    } catch (error) {
        console.error('Error calling the mint function:', error);
    }
    const tokenId = await contract.getNextTokenId();
    //DO THE TRANSFER
    try {
        // Call the transfer function with a token URI
        const result = await contractInstance.transfer(recipientAddress);
        const txHash = result.hash;
        console.log('Transfer result:', result);
        const obj = {txHash, tokenId: Number(tokenId.toString()), recipientAddress,tokenUri,contractAddress}
        return obj;
    } catch (error) {
        console.error('Error calling the Transfer function:', error);
    }

}

module.exports = {
    getTokenId,
    mintAndTransfer,
    getEnvVars,
    fetchPngUrlFromContract,
    getNFTImageUrl,
    getNextTokenId,
    getNFTImageUrlFromTokenUri,
    getContractAndOwnerAddresses,
    getTokenUriJson}
