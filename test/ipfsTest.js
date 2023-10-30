/*
run using the command
npx hardhat test --files test/ipfsTest.js
 */

const {uploadDiltyPng} = require("../scripts/upload-dilty-to-ipfs");
const { expect } = require("chai");
const tokenName = "Dilty";

describe(`${tokenName} IPFS test`, function () {
    it("Can upload Dilty PNG", async function () {
        const  result  = await uploadDiltyPng();
        console.log(JSON.stringify(result, null, 2));
        expect(result).to.not.be.null;
        expect(result.ipnft).to.be.a('string');
        expect(result.url).to.be.a('string');
    });
});
