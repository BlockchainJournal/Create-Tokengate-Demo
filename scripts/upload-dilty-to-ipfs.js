const fs = require('fs');
const {join} = require('path');
const {infuraUrl, infuraApiKey, nftStorageKey } = require('../hardhat.config');
const { NFTStorage, File } = require('nft.storage');

async function main() {


    const filePath = join(__dirname, '../images', 'dilty-icon.png');

    try {
        const client = new NFTStorage({ token: nftStorageKey});
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
      } catch (error) {
        // Handle errors that may occur during the execution
        console.error('Error while storing metadata:', error);
      }
}

console.log('starting');
main();
