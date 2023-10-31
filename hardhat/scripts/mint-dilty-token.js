const Web3 = require('web3');
const axios = require('axios');

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

async function discoverToken(tokenAddress, tokenId) {

// Your Etherscan API key
    const apiKey = 'YOUR_ETHERSCAN_API_KEY';

// Contract address and token ID of the NFT you want to retrieve
    const contractAddress = '0xYourContractAddress';
    //const tokenId = '123'; // Replace with the actual token ID

// URL for fetching NFT information using the Etherscan API
    const apiUrl = `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTokenMetadata&contractaddress=${contractAddress}&id=${tokenId}&apikey=${apiKey}`;

    axios
        .get(apiUrl)
        .then((response) => {
            const data = response.data;
            if (data.status === '1') {
                const result = data.result;
                console.log('NFT Information:');
                console.log('Name:', result.name);
                console.log('Symbol:', result.symbol);
                console.log('Owner:', result.owner);
                console.log('Description:', result.description);
                console.log('Token URI:', result.tokenURI);
                // You can access other NFT details here
            } else {
                console.error('Error:', data.result);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });


}

