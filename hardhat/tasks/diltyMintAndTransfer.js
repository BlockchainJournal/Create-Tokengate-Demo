const { task} = require('hardhat/config');
const {Contract} = require("ethers");
const { validateConfig } = require('./validateConfig');
const {join} = require("path");
const fs = require("fs");

task('diltyMintAndTransfer', 'A custom task that mints a DiLTy NFT and transfers it to the specified address defined the recipientAddress parameter.')
    .addParam('recipientaddress', 'The recipient address as an 0x string')
    .setAction(async (taskArgs, hre) => {
        const getParams = async () => {
            const directoryPath = join(__dirname,'./data');
            const resultObj = {};

            // Get contract ABI from file
            let json = fs.readFileSync(join(directoryPath, 'dilty-abi.json'),'utf8');
            resultObj['contractABI'] = JSON.parse(json);

            // Get contract address from file
            json = fs.readFileSync(join(directoryPath, 'dilty-contract-address.json'),'utf8');
            resultObj['contractAddress'] = JSON.parse(json).contractAddress;
            // Get tokenUri CID from file
            json = fs.readFileSync(join(directoryPath, 'dilty-ipfs.json'),'utf8');
            const cid = JSON.parse(json).cid;
            resultObj['tokenUri'] = `ipfs://${cid}`;
            // Get the next token ID from contract
            const [deployer] = await ethers.getSigners();
            const artifact = await hre.artifacts.readArtifact('Dilty');
            const abi = artifact.abi;
            console.log("The contract address is: " + resultObj['contractAddress']);
            const contract = hre.ethers.getContractAt('Dilty', resultObj['contractAddress']);
            const tokenId = await contract.name();
            resultObj['tokenId'] = tokenId;

            return resultObj;
        }
        const { adminPrivateKey } = hre.network.config;
        const configParams = await getParams();
        if(!taskArgs.recipientaddress) throw new Error('The recipientaddress parameter is required.');
        validateConfig(configParams);

        // Mint the NFT
        const [deployer] = await ethers.getSigners();
        const abi = require('./data/dilty-abi.json');
        const abiArray = Object.keys(abi).map(key => abi[key]);
        const contract = new Contract(configParams.contractAddress, abiArray, deployer);
        const rst = await contract.mint(configParams.tokenUri);

        console.log('NFT minted successfully!');
        console.log('Transaction Hash:', rst.hash);
        const tokenId = configParams.tokenId;
        // Transfer the ERC-721 token to the recipient
        const tx = await contract["transfer(address)"](
            taskArgs.recipientaddress
        );

        await tx.wait();

        console.log(`Transferred NFT with token ID ${configParams.tokenId} to recipient ${taskArgs.recipientaddress} at contract address ${configParams.contractAddress}`);
    });
