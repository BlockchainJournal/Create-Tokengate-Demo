const {Web3} = require("web3");
const axios = require('axios');
const {join} = require('path');
const fs = require('fs');
// Define the path to your .env file
const envFilePath = join(__dirname, '../.env'); // Replace '.env' with the actual filename if it's different

const dotenv = require('dotenv');
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

async function verifyTokenOwnership(tokenAddress, userAddress, tokenId, tokenAbi) {
    const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

    try {
        const owner = await tokenContract.methods.ownerOf(tokenId).call();
        if (owner.toLowerCase() === userAddress.toLowerCase()) {
            console.log(`Token ID ${tokenId} is owned by address ${userAddress}`);
        } else {
            console.log(`Token ID ${tokenId} is NOT owned by address ${userAddress}`);
        }
    } catch (error) {
        console.error('Error checking ownership:', error);
    }
}

async function mintAndTransfer(recipientAddress) {

    const addresses = await getContractAndOwnerAddresses();
    // Replace these with your contract's ABI and address
    const abi = await getAbi();

    const contractABI = [
        abi
    ];
    const contractAddress = addresses.diltyAddress;

// Create a contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);

// Set your sender address (the address from which the transaction will be sent)
    const ownerAddress = addresses.deployerAddress;
    const privateKey = process.env.SEPOLIA_PRIVATE_KEY;

    const ownerAccount = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
// Token URI and recipient address
    const tokenURI = 'ipfs://bafyreicr7m3girs3gmvrm6qyxrn6bpcre5yfm3nkq34xxfypajoua3f4qm/metadata.json'; // Replace with the actual token URI

// Encode the function call (data) to call mintAndTransferSuperDiltyNFT
    let functionData;

    try {
        functionData = await contract.methods.mintAndTransferSuperDiltyNFT(tokenURI, recipientAddress).encodeABI();
    } catch (e) {
        console.error('Error encoding function call:', e);
    }

// Create a transaction object
    const txObject = {
        from: ownerAccount.address,
        to: recipientAddress,
        gas: 200000, // You may need to adjust the gas limit
        data: functionData,
    };

// Sign the transaction
    web3.eth.accounts.signTransaction(txObject, privateKey).then((signedTx) => {
        // Send the signed transaction
        web3.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .on('receipt', (receipt) => {
                return {transactionReceipt: receipt}
            })
            .on('error', (error) => {
                console.error('Transaction error:', error);
            });
    });
}
module.exports = {verifyTokenOwnership,mintAndTransfer,getEnvVars}
