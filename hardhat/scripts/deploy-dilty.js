const fs = require('fs');
const {join} = require('path');
const { ethers} = require('hardhat');

/*
The purpose of this script is to deploy the Dilty contract to the blockchain.

In this case, Solidity smart contract in the directory name contracts and in the file
name dilty02.sol. The contract is deployed to the blockchain using the method
named, deployDiltyContract().

The method will then write the address of the contract to a file in the data directory.
This file will be used by the website to interact with the contract.

You can view the contract by address at https://sepolia.etherscan.io/.

Call sample:

CONTRACT_NAME=Dilty07 npx hardhat run scripts/deploy-dilty.js --network sepolia
 */

/**
 * Deploys the Dilty contract
 * @returns {Promise<{address: *}>} The address of the deployed contract
 */
async function deployDiltyContract() {

    const [deployer] = await ethers.getSigners();

    // Error is the environment variable is not set CONTRACT_NAME is not set
    if (!process.env.CONTRACT_NAME) {
        throw new Error('CONTRACT_NAME environment variable is not set');
    }
    console.log(`Deploying contract with the contract name: ${process.env.CONTRACT_NAME}`);
    const contract = await ethers.deployContract(process.env.CONTRACT_NAME);
    console.log("Dilty address:", await contract.getAddress());

    const data = {diltyAddress: await contract.getAddress(), deployerAddress: deployer.address}

    const directoryPath = join(__dirname, './data');
    // Create the directory if it doesn't exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, {recursive: true});
    }

    const filePath = join(directoryPath, 'dilty-addresses.json');

    // Create the directory if it doesn't exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Write the JSON data to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    // Copy the address data to the website
    const websiteDataPath = join(__dirname, '../../website/src/data');
    if (!fs.existsSync(websiteDataPath)) {
        fs.mkdirSync(websiteDataPath, {recursive: true});
    }
    const websiteJsonFilePath = join(websiteDataPath, 'dilty-addresses.json');
    console.log(`Copying ${filePath} to ${websiteJsonFilePath}`);
    fs.copyFileSync(filePath, websiteJsonFilePath);

    return contract;
  }

deployDiltyContract()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })

// export the function for testing
module.exports = { deployDiltyContract };
