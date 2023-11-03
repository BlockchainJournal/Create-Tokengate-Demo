const fs = require('fs');
const {join} = require('path');
const {nftStorageKey} = require('../hardhat.config');
const { NFTStorage, File } = require('nft.storage');

async function uploadDiltyPng() {
    let filePath = join(__dirname, '../images', 'dilty-icon.png');
    const client = new NFTStorage({token: nftStorageKey});
    const metaData = await client.store({
        name: "Blockchain Journal DiLTy",
        description: "A PNG Experimental Blockchain Journal NFT",
        image: new File([await fs.promises.readFile(filePath)], "dilty.png", {
            type: "image/png",
        }),
        // Additional properties or code
    });

    const directoryPath = '../website/src/contracts/';
    filePath = join(directoryPath, 'tokenuri-data.json');


    // Create the directory if it doesn't exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Write the JSON data to the file
    fs.writeFileSync(filePath, JSON.stringify(metaData, null, 2));

    // Handle the metadata result here if needed
    console.log('Metadata stored successfully:', JSON.stringify(metaData, null,2));
    return metaData;
}

uploadDiltyPng()
module.exports = {uploadDiltyPng};
