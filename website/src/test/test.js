const {describe, it} = require("mocha");
const {expect} = require("chai");
const {mintAndTransfer, verifyTokenOwnership} = require('../lib/contractHelpers')
const {join} = require('path');
const envFilePath = join(__dirname, '../.env'); // Replace '.env' with the actual filename if it's different
const dotenv = require('dotenv');
const fs = require("fs");
dotenv.config({ debug: true, path: envFilePath});

describe('Token Gating tests', () => {
    it("can verify user token ownership", async () => {
        const userAddress = "0x9e4aF6FDa84260f957Ff65E1EE447E522C5E0e27";
        const result = await verifyTokenOwnership(userAddress);
        expect(result).to.equal(true);
    })

    it("can mint token and transfer on Ether`", async () => {
        // get the tokenUri
        const directoryPath = join(__dirname,'../contracts/');
        const filePath = join(directoryPath, 'tokenuri-data.json');
        // Write the JSON data to the file
        const rslt = fs.readFileSync(filePath);
        const jsonObject = JSON.parse(rslt);
        await mintAndTransfer(process.env.RECIPIENT_ADDRESS, jsonObject.url.replace('/metadata.json','') );

    }).timeout(5000);
});
