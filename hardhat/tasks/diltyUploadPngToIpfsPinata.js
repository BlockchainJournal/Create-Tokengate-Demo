const fs = require('fs');
const {join} = require('path');
const pinataSDK = require('@pinata/sdk');
const { task} = require('hardhat/config');

let taskDescription = 'A custom task that uploads the DiLTy png stored in ./images/dilty-icon.png to IPFS and writes the CID to a file named ./data/dilty-ipfs-cid.json'
task('diltyUploadPngToIpfsPinata', taskDescription)
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

        try { // Upload the file and metadata to Pinata
            const result = await pinata.pinFileToIPFS(readableStream, {
                pinataMetadata: metadata
            });

            const ipfsCid = result.IpfsHash;

            const directoryPath = join(__dirname, './data');
            // Create the directory if it doesn't exist
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, {recursive: true});
            }
            const jsonFilePath = join(directoryPath, 'dilty-ipfs.json');
            console.log(`Writing CID ${ipfsCid} to ${jsonFilePath}`);
            // Write the ABI JSON data to the file
            fs.writeFileSync(jsonFilePath, JSON.stringify({cid: ipfsCid}, null, 2));
        } catch (e) {
            console.error(e);
        }
    });
