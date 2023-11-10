const fs = require('fs');
const {join} = require('path');
const pinataSDK = require('@pinata/sdk');
const { task} = require('hardhat/config');

let taskDescription = 'A custom task that uploads the DiLTy png stored in ./images/dilty-icon.png to IPFS and writes the CID to a file named ./data/dilty-ipfs-cid.json'
task('diltyUploadPngToIpfsPinata', taskDescription)
    .setAction(async (taskArgs, hre) => {
        const { pinataApiKey, pinataSecretApiKey } = hre.network.config;

        // The image the will be posted to IPFS
        let filePath = join(__dirname, '../images', 'art-01.png');
        // Use the api keys by providing the strings directly
        const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey );
        const res = await pinata.testAuthentication()

        const readableStream = fs.createReadStream(filePath);
        // Create the metadata object for pinata
        const metadata = {
            name: 'Cool Headshot',
            description: 'A simple headshot of a cool person',
            type: 'image/png'
        };

        try {
            // The object ipfsData will be populated with both CID for the
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
            const gatewayUrl = 'https://gateway.pinata.cloud/ipfs/'

            // creat the JSON for the tokenUri and store it on IPFS.
            const ipfMetaJson = {};
            ipfMetaJson.name = metadata.name;
            ipfMetaJson.description = metadata.description;
            ipfMetaJson.image = `${gatewayUrl}${ipfsCid}`;

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
        } catch (e) {
            console.error(e);
        }
    });
