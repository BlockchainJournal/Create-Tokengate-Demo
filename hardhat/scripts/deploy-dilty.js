const fs = require('fs');
const {join} = require('path');
/**
 * Deploys the Dilty contract
 * @returns {Promise<{address: *}>} The address of the deployed contract
 */
async function deployDiltyContract() {

    const [deployer] = await ethers.getSigners();

    //console.log("Deploying contracts with the account:", deployer.address);

    const contract = await ethers.deployContract("Dilty");
    console.log("Dilty address:", await contract.getAddress());

    const data = {diltyAddress: await contract.getAddress(), deployerAddress: deployer.address}

    const directoryPath = '../website/src/contracts/';
    const filePath = join(directoryPath, 'dilty-addresses.json');

    // Create the directory if it doesn't exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Write the JSON data to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return contract;
  }

deployDiltyContract();
