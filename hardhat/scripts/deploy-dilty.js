/**
 * Deploys the Dilty contract
 * @returns {Promise<{address: *}>} The address of the deployed contract
 */
async function deployDiltyContract() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const contract = await ethers.deployContract("Dilty");
    console.log("Dilty address:", await contract.getAddress());
    console.log(`Contract: ${JSON.stringify(contract, null, 2)}`);

    return contract;
  }

deployDiltyContract();
