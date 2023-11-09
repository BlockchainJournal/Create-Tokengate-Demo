const {task} = require('hardhat/config');
const {join} = require("path");
const fs = require("fs");


let taskDescription = 'The task that uploads the DiLTy contract to the blockchain as stored in the ./contracts/dilty.sol file and writes the ABI json to a file named ./data/dilty-abi.json and the contract address to a file named ./data/dilty-contract-address.json'
task('diltyDeployContract', taskDescription)
    .setAction(async (taskArgs, hre) => {
        const {chainId} = await hre.ethers.provider.getNetwork();
        console.log(`Chain ID: ${chainId}`);
        const privateKey = hre.config.privateKey;
        console.log(`Private Key: ${privateKey}`);
        const signer = new hre.ethers.Wallet(privateKey);
        const contractFactory = await hre.ethers.getContractFactory("Dilty");
        const contract = await contractFactory.deploy(
            {
                signer: signer,
                network: 'sepolia', // Specify the network name
                chainId: 11155111,
                gasLimit: 260000,
                gasPrice: hre.ethers.parseUnits('10', 'gwei'),
                value: 1
            });
        await contract.waitForDeployment();
        const contractAddress = contract.address;
        console.log(`Contract deployed to: ${contractAddress}`);
        //const contractABI = Contract.interface;
        // Write the ABI to a file
        const abi = contract.interface;
        //const abiJson = JSON.stringify(abi);
        const directoryPath = join(__dirname, './data');
        // Create the directory if it doesn't exist
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, {recursive: true});
        }
        let filePath = join(directoryPath, 'dilty-abi.json');
        console.log(`Writing ABI to ${filePath}`);
        // Write the ABI JSON data to the file
        fs.writeFileSync(filePath, JSON.stringify(abi, null, 2));
        // Write the contract address to a file
        filePath = join(directoryPath, 'dilty-contract-address.json');
        console.log(`Writing contract address: ${contract.address} to ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify({contractAddress: contract.address}, null, 2));

        //confirm tha the contract is accessible

    });
