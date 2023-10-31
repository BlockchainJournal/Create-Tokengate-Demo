const Web3 = require("web3");
const axios = require('axios');
const {join} = require('path');
const web3 = new Web3('YOUR_ETHEREUM_NODE_URL');
const fs = require('fs');

async function getEnvVars(){
    join(__dirname, '../.env')
    return process.env;
}

async function getAbi(){
    const filePath = join(__dirname, '../website/src/contracts', 'dilty-abi.json');
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
;

// Replace these with your contract's ABI and address
    const contractABI = [
        getAbi()
    ];
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';

// Create a contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);

// Set your sender address (the address from which the transaction will be sent)
    const senderAddress = 'YOUR_SENDER_ADDRESS';
    const privateKey = 'YOUR_SENDER_PRIVATE_KEY';

// Token URI and recipient address
    const tokenURI = 'ipfs://bafyreicr7m3girs3gmvrm6qyxrn6bpcre5yfm3nkq34xxfypajoua3f4qm/metadata.json'; // Replace with the actual token URI
    //const recipientAddress = '0xADeB8052682aeF1A7B127fC158fAdEd08a19A843'; // Replace with the recipient's address

// Encode the function call (data) to call mintAndTransferSuperDiltyNFT
    const functionData = contract.methods.mintAndTransferSuperDiltyNFT(tokenURI, recipientAddress).encodeABI();

// Create a transaction object
    const txObject = {
        from: senderAddress,
        to: contractAddress,
        gas: 200000, // You may need to adjust the gas limit
        data: functionData,
    };

// Sign the transaction
    web3.eth.accounts.signTransaction(txObject, privateKey).then((signedTx) => {
        // Send the signed transaction
        web3.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .on('receipt', (receipt) => {
                console.log('Transaction receipt:', receipt);
            })
            .on('error', (error) => {
                console.error('Transaction error:', error);
            });
    });
}


module.exports = {verifyTokenOwnership,mintAndTransfer,getEnvVars}
