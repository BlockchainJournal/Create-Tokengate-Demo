const fs = require('fs');
const {join} = require('path');
const pinataSDK = require('@pinata/sdk');
const { task} = require('hardhat/config');

/*
The purpose of this script is to upload an asset to IPFS using the Pinata service.

Options:
    --image-file-path: The exact path to the image file of the asset to upload to IPFS
    --asset-name: The name of the asset being uploaded to IPFS
    --asset-description: The description of the asset being uploaded to IPFS

Command line example

npx hardhat  diltyUploadPngToIpfsPinata --asset-name "Reselbob Two" --asset-description "A new NFT published by Reselbob" --image-file-path "~/Projects/Create-Tokengate-Demo/hardhat/images/reselbob-02.png" --show-stack-traces

 */

let taskDescription = 'A custom task that uploads an asset to IPFS and writes the CID to a file named ./data/dilty-ipfs-cid.json'
const defaultImageFilePath = join(__dirname, '../images', 'dilty-icon.png');
const defaultName= 'Dilty';
const defaultDescription='Designed by Blockchain Journal';
task('diltyUploadPngToIpfsPinata', taskDescription)
    .addOptionalParam('imageFilePath', 'The path to the image file of the asset to upload to IPFS', defaultImageFilePath)
    .addOptionalParam('assetName', 'The name of the asset being uploaded to IPFS', defaultName)
    .addOptionalParam('assetDescription', 'The description of the asset being uploaded to IPFS',defaultDescription)
    .setAction(async (taskArgs, hre) => {
        const { pinataApiKey, pinataSecretApiKey } = hre.network.config;

        // The image that will be posted to IPFS
        const imageFilePath = taskArgs.imageFilePath || join(__dirname, '../images', 'dilty-icon.png');
        //let filePath = join(__dirname, '../images', 'dilty-icon.png');
        // Use the api keys by providing the strings directly
        const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey );
        const res = await pinata.testAuthentication()

        // create the metadata object for pinata, if the params are not present use a default value
        const metadata = {
            name: taskArgs.assetName,
            description: taskArgs.assetDescription,
            type: 'image/png'
        };

        const readableStream = fs.createReadStream(imageFilePath);

        try {
            // The object named ipfsData will be populated with both CID for the
            // image and as well as the CID for the JSON metadata that will
            // be the tokenURI for the NFT
            const ipfsData = {};

            let result = await pinata.pinFileToIPFS(readableStream, {
                pinataMetadata: metadata
            });

            // grab the IPFS cid for the image that's returned by the upload
            const ipfsCid = result.IpfsHash;
            //
            ipfsData.imageCid = ipfsCid;
            // Declare the IPFS gateway URL that will be used as the value for
            // the image property in the tokenUri JSON metadata
            const gatewayUrl = 'https://ipfs.io/ipfs/'

            // creat the JSON for the tokenUri and store it on IPFS.
            const ipfMetaJson = {};
            ipfMetaJson.name = metadata.name;
            ipfMetaJson.description = metadata.description;
            ipfMetaJson.image = `${gatewayUrl}${ipfsCid}`;
            // try adding a new field
            ipfMetaJson.level = 2;

            // Use the pinata SDK to upload the TokenUri JSON to IPFS
            result = await pinata.pinJSONToIPFS(ipfMetaJson);
            ipfsData.metadataCid = result.IpfsHash;

            // Store all the CID information created by uploading the image and
            // the tokenUri metadata to IPFS in a JSON file named dilty-ipfs.json
            const directoryPath = join(__dirname, '../scripts/data');

            // Create the directory if it doesn't exist
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, {recursive: true});
            }
            const jsonFilePath = join(directoryPath, 'dilty-ipfs.json');
            console.log(`Writing to ${jsonFilePath} the following ${JSON.stringify(ipfsData, null, 2)}`);
            // Write ipfsData data to the file
            fs.writeFileSync(jsonFilePath, JSON.stringify(ipfsData, null, 2));

            // Copy the dilty-ipfs.json file to the website/data directory
            const websiteDataPath = join(__dirname, '../../website/src/data');
            if (!fs.existsSync(websiteDataPath)) {
                fs.mkdirSync(websiteDataPath, {recursive: true});
            }
            const websiteJsonFilePath = join(websiteDataPath, 'dilty-ipfs.json');
            console.log(`Copying ${jsonFilePath} to ${websiteJsonFilePath}`);
            fs.copyFileSync(jsonFilePath, websiteJsonFilePath);
        } catch (e) {
            console.error(e);
        }
    });
