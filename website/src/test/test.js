const {describe, it} = require("mocha");
const {expect} = require("chai");
const {mintAndTransfer, getTokenId, fetchPngUrlFromContract, getNFTImageUrl, getNextTokenId, getNFTImageUrlFromTokenUri,
    getTokenUriJson} = require('../lib/contractHelpers')
const {join} = require('path');
const envFilePath = join(__dirname, '../.env'); // Replace '.env' with the actual filename if it's different
const dotenv = require('dotenv');
const fs = require("fs");
dotenv.config({ debug: true, path: envFilePath});

const TEST_ADDRESS = "0x5D89a3eA5edd7C09B25995520fC98c8F4020fa15";

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
        const regex = /ipfs:\/\/(.+)/;
        expect(result).to.match(regex);

    })
    it("can extract png from contract", async () => {
        const result = await fetchPngUrlFromContract(1);
        expect(result).to.be.a("string");
        const regex = /ipfs:\/\/(.+)/;
        expect(result).to.match(regex);
    })

    it("can getTokenId", async () => {
        const userAddress = TEST_ADDRESS ;
        const result = await getTokenId(userAddress);
        expect(result).to.be.a('number');
        expect(result).to.be.greaterThan(0);
    })

    it("can getTokenUriJson", async () => {
        const userAddress = TEST_ADDRESS ;
        const result = await getTokenId(userAddress);
        console.log(result);
        expect(result).to.be.a('number');
        expect(result).to.be.greaterThan(0);
        const json = await getTokenUriJson(result);
        expect(json).to.be.an('object');
    })

    it("can mint token and transfer on Ether`", async () => {
        const result = await mintAndTransfer(TEST_ADDRESS) ;
        expect(result).to.be.an('object');
        expect(result.tokenId).to.be.greaterThan(0);
        // expect the txHash not to be empty and to be a hex string
        expect(result.txHash).to.be.a('string');
        expect(result.txHash).to.match(/^(0x)?[0-9a-fA-F]+$/);
        console.log(JSON.stringify(result, null, 2));
    }).timeout(5000);
});
