const {Web3,ethers} = require("web3");
const BN = require('web3-utils').BN;

const axios = require('axios');
const {join} = require('path');
const fs = require('fs');
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
    const ownerAccount = await web3.eth.accounts.privateKeyToAccount('0x' + privateKey);

    if(!tokenUri) throw new Error('Required parameter tokenUri is missing');

    const addresses = await getContractAndOwnerAddresses();


    const abiFilePath = join(__dirname, '../contracts', 'dilty-abi.json');

    const contractAddress = addresses.diltyAddress;

    const contractABI = require(abiFilePath);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const contractMethods = contract.methods;
    const mintData = await contractMethods.mint(tokenUri).encodeABI();
    let gasEstimate = await contractMethods.mint(tokenUri).estimateGas({ from: ownerAccount.address});

    const txConfig = {
        from: ownerAccount.address,
        to: contractAddress,
        value: 0,
        gas: Number(gasEstimate) + 10000,
        gasPrice: 20000000000,
        data: mintData,
    }

    try {
        const signedTx = await web3.eth.accounts.signTransaction(txConfig, ownerAccount.privateKey);
        console.log(`Sending transaction from account: ${ownerAccount.address} to contract: ${contractAddress}`);
        const result = await web3.eth.sendSignedTransaction(signedTx);
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('Error sending the transaction:', e);
    }


// NOW DO THE TRANSFER
    try {
        const transferData = await contractMethods.transfer(recipientAddress).encodeABI();
        const signedTx = await web3.eth.accounts.signTransaction({
            from: ownerAccount.address,
            to: contractAddress,
            value: 0,
            gas: Number(gasEstimate) + 10000,
            gasPrice: 20000000000,
            data: transferData,
        }, ownerAccount.privateKey);

        const result = await web3.eth.sendSignedTransaction(signedTx);
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('Error sending the transaction:', e);
    }
}
module.exports = {verifyTokenOwnership,mintAndTransfer,getEnvVars}
