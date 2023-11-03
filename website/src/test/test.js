const {describe, it} = require("mocha");
const {expect} = require("chai");
const {mintAndTransfer, verifyTokenOwnership} = require('../lib/contractHelpers')
const {join} = require('path');

// Define the path to your .env file
const envFilePath = join(__dirname, '../.env'); // Replace '.env' with the actual filename if it's different

const dotenv = require('dotenv');
const fs = require("fs");

dotenv.config({ debug: true, path: envFilePath});

describe('Token Gating tests', () => {
    it("can verify user token ownership", async () => {
        const contractAddress = "0xF2B3cD887A14d3eda09C051e9a52802bC49ACCbe";
        const userAddress = "0x9e4aF6FDa84260f957Ff65E1EE447E522C5E0e27";
        const tokenId = 1;
        result = await verifyTokenOwnership(contractAddress, userAddress, tokenId);
        expect(result).to.equal(true);


    })
    it("can mint token`", async () => {
        const envars = process.env;

        // get the tokenUri
        const directoryPath = join(__dirname,'../contracts/');
        const filePath = join(directoryPath, 'tokenuri-data.json');


        // Write the JSON data to the file
        const rslt = fs.readFileSync(filePath);
        const jsonObject = JSON.parse(rslt);

        try {
            const contract = await mintAndTransfer(process.env.RECIPIENT_ADDRESS, jsonObject.url.replace('/metadata.json',''));
            console.log(JSON.stringify(contract, null, 2));
        } catch (e) {
            console.error(e)
        }

    }).timeout(50000);


});
