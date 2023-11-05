const { task} = require('hardhat/config');
const {Contract} = require("ethers");
const { validateConfig } = require('./validateConfig');

task('diltyMintAndTransfer', 'A diltyConfiguration object for the mint and transfer task.The object REQUIRES the following properties: {contractABI as JSON, contractAddress, tokenUri, tokenID, recipientAddress}')
    .addParam('diltyconfig', {
        type: 'object',
        paramTypes: {
            contractABI: {
                type: 'string',
                description: 'The contract ABI of the DiLTy contract.'
            },
            contractAddress: {
                type: 'string',
                description: 'The address of the DiLTy contract.'
            },
            tokenUri: {
                type: 'string',
                description: 'The tokenUri to apply to the minted token.'
            },
            tokenId: {
                type: 'number',
                description: 'The token ID to mint and transfer.'
            },
            recipientAddress: {
                type: 'string',
                description: 'The recipient address for the token transfer.'
            }
        },
        description: 'A diltyConfiguration object for the mint and transfer task.The object REQUIRES the following properties: contractABI as JSON, contractAddress, tokenUri, tokenID, recipientAddress'
    })
    .setAction(async (taskArgs, hre) => {
        const { adminPrivateKey } = hre.network.config;
        validateConfig(taskArgs.diltyConfig);

        const contractABI = taskArgs.diltyConfig.contractABI;
        const [deployer] = await ethers.getSigners();
        const contract = new Contract(taskArgs.diltyConfig.contractAddress, contractABI, deployer);
        const rst = await contract.mint(taskArgs.diltyConfig.tokenUri);

        console.log('NFT minted successfully!');
        console.log('Transaction Hash:', rst.hash);
        const tokenId = taskArgs.diltyConfig.tokenId;
        const recipientAddress = taskArgs.diltyConfig.recipientAddress;
        // Transfer the ERC-721 token to the recipient
        const tx = await contract["transfer(address)"](
            recipientAddress
        );

        await tx.wait();
        console.log(JSON.stringify({tokenId,recipientAddress}, null, 2));
        //console.log(`Transferred NFT with token ID ${tokenId} to ${recipientAddress}`)
    });
