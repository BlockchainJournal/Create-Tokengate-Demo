const {describe, it} = require("mocha");
const {expect} = require("chai");
const {mintAndTransfer} = require('../lib/contractHelpers')
const {join} = require('path');

// Define the path to your .env file
const envFilePath = join(__dirname, '../.env'); // Replace '.env' with the actual filename if it's different

const dotenv = require('dotenv');
//dotenv.config({ debug: true,path: envFilePath });

describe('Token Gating tests', () => {
    it("can transfer token`", async () => {
        const envars = process.env;

        try {
            const contract = await mintAndTransfer(process.env.RECIPIENT_ADDRESS);
            console.log(JSON.stringify(contract, null, 2));
        } catch (e) {
            console.error(e)
        }
    })


});
