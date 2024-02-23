const {privateKey, infuraUrl} = require("../hardhat.config.js");
const { JsonRpcProvider} = require('ethers');
const {ethers} = require("hardhat");
const fs = require("fs");
const {join} = require("path");

/*
Sample call:
RECIPIENT_ADDRESS=0x9e4aF6FDa84260f957Ff65E1EE447E522C5E0e27 npx hardhat run scripts/mint-n-transfer-dilty.js --network sepolia

 */
async function mintAndTransferNFT() {
    try {
        const directoryPath = join(__dirname, './data');
        let filePath = join(directoryPath, 'dilty-addresses.json');
        const json = fs.readFileSync(filePath, 'utf8');
        const contractAddress = JSON.parse(json).diltyAddress;
        const contractABI = require("./data/dilty-abi.json");

        const provider = new JsonRpcProvider(infuraUrl);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        console.log("contractAddress:", contractAddress);

        const contractName = await contract.name();
        console.log("Contract Name:", contractName);


        // Get the IPFS metadata CID
        filePath = join(directoryPath, 'dilty-ipfs.json');
        const jsonIpfs = fs.readFileSync(filePath, 'utf8');
        const metadataCid = JSON.parse(jsonIpfs).metadataCid;
        const gatewayUrl = 'ipfs://';
        const signer = new ethers.Wallet(privateKey);
        const tokenUri = `${gatewayUrl}${metadataCid}`;
        const wallet = new ethers.Wallet(privateKey, provider);


        console.log('Minting NFT...');
        const contractAbi = require("./data/dilty-abi.json");
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, wallet);
        const result = await contractInstance.mint(tokenUri, process.env.RECIPIENT_ADDRESS);
        const newTokenId = await contract.getNextTokenId();
        console.log('newTokenId:', Number(newTokenId.toString()));

        console.log('Transferring token as ID :', newTokenId.toString());
        const recipientAddress = process.env.RECIPIENT_ADDRESS
        // Turn on if you want to see the transfer output
        //const result2 = await contractInstance.transfer(recipientAddress);
        //console.log('Transfer output:: ', JSON.stringify(result2, null, 2));
        const obj = {tokenId: Number(newTokenId.toString()), recipientAddress,tokenUri,contractAddress}

        console.log(`Result: ${JSON.stringify(obj, null, 2)}`);
    } catch (e) {
        console.error('Error minting and transferring NFT:', e);
    }
}

mintAndTransferNFT()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
