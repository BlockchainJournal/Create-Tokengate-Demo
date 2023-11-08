const {describe, it} = require("mocha");
const {expect} = require("chai");
const {mintAndTransfer, verifyTokenOwnership, fetchPngUrlFromContract, getNFTImageUrl, getNextTokenId} = require('../lib/contractHelpers')
const {join} = require('path');
const envFilePath = join(__dirname, '../.env'); // Replace '.env' with the actual filename if it's different
const dotenv = require('dotenv');
const fs = require("fs");
dotenv.config({ debug: true, path: envFilePath});

describe('Token Gating tests', () => {

    it("can get nextTokenId", async () => {
        const result = await getNextTokenId();
        expect(Number(result)).to.be.a("number");
    });

    it("can can get png url", async () => {
        const result = await getNFTImageUrl("QmPsV3UnruNFBepM4fUXJnnDEypPa9nVtKCXa9gmpFUrmx")
        expect(result).to.be.a("string");
        expect(result).to.match(/^(https?:\/\/)?[^\s]+\.[^\s]+$/);
    })
    it("can extract png from contract", async () => {
        const result = await fetchPngUrlFromContract(5)
        expect(result).to.be.a("string");
        expect(result).to.match(/^(https?:\/\/)?[^\s]+\.[^\s]+$/);
    })

    it("can verify user token ownership", async () => {
        const userAddress = "0xADeB8052682aeF1A7B127fC158fAdEd08a19A843";
        //const userAddress = "0x9e4aF6FDa84260f957Ff65E1EE447E522C5E0e27";
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
