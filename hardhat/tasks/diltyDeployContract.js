const { task } = require('hardhat/config');

task('diltyDeployContract', 'The task that uploads the DiLTy contract to the blockchain as stored in the ./contracts/dilty.sol file and returns a JSON object as {contractAddress, contractABI}')
    .setAction(async (taskArgs, hre) => {
        const [deployer] = await ethers.getSigners();
        const contract = await ethers.deployContract("Dilty");
        const Contract = await ethers.getContractFactory('Dilty');
        const contractABI = Contract.interface;
        console.log(JSON.stringify({ contractAddress: await contract.getAddress(), contractABI}, null, 2));
    });
