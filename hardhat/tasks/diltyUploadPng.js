const fs = require('fs');
const {join} = require('path');
const { NFTStorage, File } = require('nft.storage');

const { task} = require('hardhat/config');

task('diltyUploadPng', 'A custom task that uploads the DiLTy png stored in ./images/dilty-icon.png to IPFS and returns the metadata as a JSON object')
    .setAction(async (taskArgs, hre) => {
        let filePath = join(__dirname, '../images', 'dilty-icon.png');
        const { nftStorageKey } = hre.network.config;
        const client = new NFTStorage({token: nftStorageKey});
        const metaData = await client.store({
            name: "Blockchain Journal DiLTy",
            description: "A PNG Experimental Blockchain Journal NFT",
            image: new File([await fs.promises.readFile(filePath)], "dilty.png", {
                type: "image/png",
            }),
        });
        console.log(JSON.stringify(metaData, null,2));
    });
