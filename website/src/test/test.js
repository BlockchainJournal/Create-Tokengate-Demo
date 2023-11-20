const {describe, it} = require("mocha");
const {expect} = require("chai");
const {mintAndTransfer, verifyTokenOwnership, fetchPngUrlFromContract, getNFTImageUrl, getNextTokenId, getNFTImageUrlFromTokenUri} = require('../lib/contractHelpers')
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

    it("can can get png url from tokenUri", async () => {
        // get the tokenUri from ./src/data/dilty-ipfs.json
        const filePath = join(__dirname, '../data', 'dilty-ipfs.json');
        // Read the file contents
        const fileContents = fs.readFileSync(filePath, 'utf8');

        // Parse the file contents as JSON
        const ipfsObj = JSON.parse(fileContents);
        const tokenUri = "ipfs://" + ipfsObj.metadataCid;

        const result = await getNFTImageUrlFromTokenUri(tokenUri);
        expect(result).to.be.a("string");
        expect(result).to.match(/^(https?:\/\/)?[^\s]+\.[^\s]+$/);

    })

    it("can can get png url", async () => {
        // get the tokenUri from ./src/data/dilty-ipfs.json
        const filePath = join(__dirname, '../data', 'dilty-ipfs.json');
        // Read the file contents
        const fileContents = fs.readFileSync(filePath, 'utf8');

        // Parse the file contents as JSON
        const ipfsObj = JSON.parse(fileContents);

        const result = await getNFTImageUrl(ipfsObj.imageCid);
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
        const result = await verifyTokenOwnership(userAddress);
        expect(result).to.equal(true);
    })

    it("can mint token and transfer on Ether`", async () => {
        const result = await mintAndTransfer(process.env.RECIPIENT_ADDRESS) ;

    }).timeout(5000);
});
