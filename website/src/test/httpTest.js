const supertest = require('supertest');
const {server} = require('../server');
const {expect} = require('chai');
const mocha = require('mocha');
const dotenv = require('dotenv');

describe('GET /token/:userAddress', () => {
    after(async () => {
        await server.close();
    });
    it('should return a success response if the user owns the token', async () => {
        const userAddress = process.env.RECIPIENT_ADDRESS;
        const response = await supertest(server).get(`/token/${userAddress}`);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Success');
        expect(response.body.tokenGating).to.equal(true);
    });

    it('should return an error response if the user does not own the token', async () => {
        const userAddress = '0xabcdef1234567890abcdef1234567890abcdef123456789';
        const response = await supertest(server).get(`/token/${userAddress}`);

        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal('Unauthorized');
        expect(response.body.tokenGating).to.equal(false);
    });
});
