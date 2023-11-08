const fs = require('fs');
const {join} = require('path');
const pinataSDK = require('@pinata/sdk');
const { task} = require('hardhat/config');

task('diltyUploadPngToIpfsPinata', 'A custom task that uploads the DiLTy png stored in ./images/dilty-icon.png to IPFS and returns the metadata as a JSON object')
    .setAction(async (taskArgs, hre) => {
        const { pinataApiKey, pinataSecretApiKey } = hre.network.config;
        let filePath = join(__dirname, '../images', 'reselbob-01.png');
        // Use the api keys by providing the strings directly
        const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey );
        const res = await pinata.testAuthentication()

        const readableStream = fs.createReadStream(filePath);
        // Create the metadata object
        const metadata = {
            name: 'Cool Headshot',
            description: 'A simple headshot of a cool person',
            type: 'image/png'
        };

        // Upload the file and metadata to Pinata
        const result = await pinata.pinFileToIPFS(readableStream, {
            pinataMetadata: metadata
        });

        const ipfsCid = result.IpfsHash;
        console.log(ipfsCid)
    });
