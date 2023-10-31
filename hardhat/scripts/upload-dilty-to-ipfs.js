const fs = require('fs');
const {join} = require('path');
const {nftStorageKey} = require('../hardhat.config');
const { NFTStorage, File } = require('nft.storage');

async function uploadDiltyPng() {
    const filePath = join(__dirname, '../images', 'dilty-icon.png');
    const client = new NFTStorage({token: nftStorageKey});
    const metaData = await client.store({
        name: "Blockchain Journal DiLTy",
        description: "A PNG Experimental Blockchain Journal NFT",
        image: new File([await fs.promises.readFile(filePath)], "dilty.png", {
            type: "image/png",
        }),
        // Additional properties or code
    });

    // Handle the metadata result here if needed
    console.log('Metadata stored successfully:', metaData);
    return metaData;
}

uploadDiltyPng()
module.exports = {uploadDiltyPng};
