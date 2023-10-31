const Web3 = require("web3");
const axios = require('axios');
const {join} = require('path');


async function getEnvVars(){
    join(__dirname, '../.env')
    return process.env;
}


async function verifyTokenOwnership(web3, tokenAddress, accountAddress, tokenAbi) {
    // Get the token contract instance.
    const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

    // Get the token balance of the account address.
    const tokenBalance = await tokenContract.methods.balanceOf(accountAddress).call();

    // If the token balance is greater than zero, then the account address owns the token.
    return tokenBalance > 0;
}

async function mintAndTransfer() {
// Initialize a Web3 instance connected to your Ethereum provider (e.g., Infura, local node, etc.)
    const web3 = new Web3('YOUR_ETHEREUM_PROVIDER_URL');

// Replace these with your contract's ABI and address
    const contractABI = [
        // Include the ABI of your contract here
    ];
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';

// Create a contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);

// Set your sender address (the address from which the transaction will be sent)
    const senderAddress = 'YOUR_SENDER_ADDRESS';
    const privateKey = 'YOUR_SENDER_PRIVATE_KEY';

// Token URI and recipient address
    const tokenURI = 'ipfs://bafyreicr7m3girs3gmvrm6qyxrn6bpcre5yfm3nkq34xxfypajoua3f4qm/metadata.json'; // Replace with the actual token URI
    const recipientAddress = '0xADeB8052682aeF1A7B127fC158fAdEd08a19A843'; // Replace with the recipient's address

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
