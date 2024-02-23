const supertest = require('supertest');
const {server} = require('../server');
const {expect} = require('chai');
const mocha = require('mocha');
const dotenv = require('dotenv');

const TEST_ADDRESS = "0x5D89a3eA5edd7C09B25995520fC98c8F4020fa15";

describe('GET /token/:userAddress', () => {
    after(async () => {
        await server.close();
    });


    it('should return contract address and owner', async () => {
        //const userAddress = process.env.RECIPIENT_ADDRESS;
        const response = await supertest(server).get(`/contract`);

        expect(response.status).to.equal(200);
        expect(response.body.diltyAddress).to.match(/^0x/i);
        expect(response.body.deployerAddress).to.match(/^0x/i);

    });

    it('should return an error response if the user does not own the token', async () => {
        const userAddress = '0xabcdef1234567890abcdef1234567890abcdef123456789';
        const response = await supertest(server).get(`/token/${userAddress}`);
        expect(response.status).to.equal(403);
        expect(response.body.error).to.a('string');
    });

    it('should mint and transfer a DiLTy token to the specified recipient address', async () => {
        const recipientAddress = TEST_ADDRESS;
        const requestBody = { recipientAddress };

        const response = await supertest(server)
            .post('/admin')
            .send(requestBody);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message');
    }).timeout(5000);
});
