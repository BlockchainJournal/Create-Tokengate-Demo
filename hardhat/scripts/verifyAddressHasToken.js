const { ethers } = require("hardhat");

/*
Command line example:

npx hardhat run scripts/verifyAddressHasToken.js --network sepolia

 */

async function verifyAddressHasToken() {

    // Replace with the contract address of the ERC-721 contract
    const contractAddress = "0x3039Cc64a6157450242B4bC9522Bea2b7D45E359";

    // Replace with the token ID you want to verify
    const tokenIdToVerify = 1; // Example token ID

    // Replace with the account address you want to check
    const addressToCheck = "0x9e4aF6FDa84260f957Ff65E1EE447E522C5E0e27"; // Replace with the address you want to check

    const contractABI = require("./dilty-abi.json");

    // Connect to the ERC-721 contract
    const contract = await ethers.getContractAt(contractABI, contractAddress);

    // Use the balanceOf function to check if the account owns the specified token
    const balance = await contract.balanceOf(addressToCheck);

    //console.log(`Balance: ${balance}`);

    if (balance === 0) {
        console.log(`Account ${addressToCheck} does not own any tokens.`);
        return;
    }

    const owner = await contract.ownerOf(tokenIdToVerify);

    if (owner === addressToCheck) {
        console.log(`Account ${addressToCheck} owns the token with ID ${tokenIdToVerify}.`);
    } else {
        console.log(`Account ${addressToCheck} does not own the token with ID ${tokenIdToVerify}.`);
    }
}

verifyAddressHasToken();
