const {networks, infuraApiKey, privateKey} = require("../hardhat.config.js");
const { AlchemyProvider, Contract } = require('ethers');
const {ethers} = require("hardhat");
const contractABI = require("./dilty-abi.json");

async function mintAndTransferNFT() {
    try {
        const contractABI = require("./dilty-abi.json");

        const [deployer] = await ethers.getSigners();
        const contract = new Contract('0xF2B3cD887A14d3eda09C051e9a52802bC49ACCbe', contractABI, deployer);
        const TokenURI = "ipfs://bafyreicr7m3girs3gmvrm6qyxrn6bpcre5yfm3nkq34xxfypajoua3f4qm";

        const rst = await contract.mint(TokenURI);

        console.log('NFT minted successfully!');
        console.log('Transaction Hash:', rst.hash);
        const tokenId = 2;
        const recipientAddress = "0x9e4aF6FDa84260f957Ff65E1EE447E522C5E0e27";
        // Transfer the ERC-721 token to the recipient
        const tx = await contract["transfer(address)"](
            recipientAddress
        );

        await tx.wait();
        console.log(`Transferred NFT with token ID ${tokenId} to ${recipientAddress}`)

    } catch (error) {
        console.error("Error transferring NFT:", error);
    }
}

mintAndTransferNFT();
