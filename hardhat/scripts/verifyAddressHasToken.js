const { ethers } = require("hardhat");
const {join} = require("path");
const fs = require("fs");

/*
Command line example:

npx hardhat run scripts/verifyAddressHasToken.js --network sepolia

 */

async function verifyAddressHasToken() {
    const directoryPath = join(__dirname, './data');
    const filePath = join(directoryPath, 'dilty-addresses.json');
    const json = fs.readFileSync(filePath, 'utf8');
    const contractAddress = JSON.parse(json).diltyAddress;
    const contractABI = require("./data/dilty-abi.json");

    // Replace with the account address you want to check
    const addressToCheck = "0x9e4aF6FDa84260f957Ff65E1EE447E522C5E0e27"; // Replace with the address you want to check

    // Connect to the ERC-721 contract
    const contract = await ethers.getContractAt(contractABI, contractAddress);

    // Use the hasAddress function to check if the address owns the specified token
    const result = await contract.hasAddress(addressToCheck);


    if (result) {
        const tokenId = await contract.getAddressTokenId(addressToCheck);
        console.log(`Account ${addressToCheck} owns the token with ID ${tokenId}.`);
    }else{
        console.log(`Account ${addressToCheck} does not own a token.`);
    }
}

verifyAddressHasToken();
