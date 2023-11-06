const {Web3} = require("web3");
const BN = require('web3-utils').BN;
const axios = require('axios');
const {join} = require('path');
const fs = require('fs');
const { ethers, JsonRpcProvider, FeeData } = require("ethers")
// Define the path to your .env file
const envFilePath = join(__dirname, '../.env'); // Replace '.env' with the actual filename if it's different

const dotenv = require('dotenv');
//const contractABI = require("./dilty-abi.json");
dotenv.config({ debug: true,path: envFilePath })

if(!process.env.INFURA_API_KEY) throw new Error('Required environment variable INFURA_API_KEY is missing');
if(!process.env.SEPOLIA_PRIVATE_KEY) throw new Error('Required environment variable SEPOLIA_PRIVATE_KEY is missing');
const providerUrl =  `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`

const web3 = new Web3(providerUrl);

async function getEnvVars(){
    join(__dirname, '../.env')
    return process.env;
}

async function getAbi(){
    const filePath = join(__dirname, '../contracts', 'dilty-abi.json');
    let abi;

    try {
        if (fs.existsSync(filePath)) {
            abi = JSON.parse(fs.readFileSync(filePath));
        } else {
            console.error(`File ${filePath} does not exist.`);
        }
    } catch (err) {
        console.error('Error reading or parsing the file:', err);
    }

    return abi;
}

async function getContractAndOwnerAddresses(){
    const filePath = join(__dirname, '../contracts', 'dilty-addresses.json');
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

async function verifyTokenOwnership(userAddress){

    const addresses = await getContractAndOwnerAddresses();
    const contractAddress = addresses.diltyAddress;

    const contractABI = await getAbi();
    // Connect to the ERC-721 contract
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const contractMethods = contract.methods;

    // Use the balanceOf function to check if the account owns the specified token
    let balanceOf;
    try {
        balanceOf = await contractMethods.balanceOf(userAddress).call();
    } catch (e) {
        return false;
    }


    if (Number(balanceOf) === 0) {
        return false;
    } else {
        return true;
    };

}

async function mintAndTransfer(recipientAddress, tokenUri) {
    const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
    const provider = new JsonRpcProvider(providerUrl);
    const addresses = await getContractAndOwnerAddresses();
    const contractAddress = addresses.diltyAddress;
    const abiFilePath = join(__dirname, '../contracts', 'dilty-abi.json');
    const contractAbi = require(abiFilePath);
    const wallet = new ethers.Wallet(privateKey, provider)
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, wallet);
    //DO THE MINT
    try {
        // Call the mint function with a token URI
        const result = await contractInstance.mint(tokenUri);
        console.log('Mint result:', result);

        // You can access the transaction hash, gas used, and other details from the result object.
    } catch (error) {
        console.error('Error calling the mint function:', error);
    }
    //DO THE TRANSFER
    try {
        // Call the mint function with a token URI
        const result = await contractInstance.transfer(recipientAddress);
        console.log('Transfer result:', result);

        // You can access the transaction hash, gas used, and other details from the result object.
    } catch (error) {
        console.error('Error calling the Transfer function:', error);
    }

}

module.exports = {verifyTokenOwnership,mintAndTransfer,getEnvVars}
