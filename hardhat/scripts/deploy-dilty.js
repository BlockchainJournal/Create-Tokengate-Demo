const fs = require('fs');
const {join} = require('path');
const { ethers, utils } = require('hardhat');

/**
 * Deploys the Dilty contract
 * @returns {Promise<{address: *}>} The address of the deployed contract
 */
async function deployDiltyContract() {

    const [deployer] = await ethers.getSigners();

    const contract = await ethers.deployContract("Dilty02");
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
