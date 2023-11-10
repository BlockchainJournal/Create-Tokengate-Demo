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
        if(!process.env.RECIPIENT_ADDRESS )throw new Error('Required environment variable RECIPIENT_ADDRESS is missing');
        console.log('RECIPIENT_ADDRESS:', process.env.RECIPIENT_ADDRESS);
        const contractAbi = require("./data/dilty-abi.json");

        const [deployer] = await ethers.getSigners();
        // get the contract address from the file
        const directoryPath = join(__dirname, './data');
        let filePath = join(directoryPath, 'dilty-addresses.json');
        const jsonAddress = fs.readFileSync(filePath, 'utf8');
        const contractAddress = JSON.parse(jsonAddress).diltyAddress;

        filePath = join(directoryPath, 'dilty-ipfs.json');
        const jsonIpfs = fs.readFileSync(filePath, 'utf8');
        const metadataCid = JSON.parse(jsonIpfs).metadataCid;
        const gatewayUrl = 'ipfs://';
        const signer = new ethers.Wallet(privateKey);
        const provider = new JsonRpcProvider(infuraUrl);
        const tokenUri = `${gatewayUrl}${metadataCid}`;
        const wallet = new ethers.Wallet(privateKey, provider);
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, wallet);
        const result = await contractInstance.mint(tokenUri,  process.env.RECIPIENT_ADDRESS);
        const nextTokenId = await contractInstance.getNextTokenId();

        console.log('NFT minted successfully!');
        console.log('Transaction Hash:', result.hash);
        const recipientAddress = process.env.RECIPIENT_ADDRESS
        //const recipientAddress = "0x9e4aF6FDa84260f957Ff65E1EE447E522C5E0e27";
        // Transfer the ERC-721 token to the recipient
        const tx = await contractInstance["transfer(address)"](
            recipientAddress
        );


        await tx.wait();
        console.log(`Transferred NFT with token ID ${Number(nextTokenId)-1} to ${recipientAddress} with Token URI ${tokenUri} at contract address ${contractAddress}`);

    } catch (error) {
        console.error("Error transferring NFT:", error);
    }
}

mintAndTransferNFT();
