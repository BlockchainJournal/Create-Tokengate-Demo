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
        //const userAddress = process.env.RECIPIENT_ADDRESS;
        const userAddress = "0xADeB8052682aeF1A7B127fC158fAdEd08a19A843"
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

    it('should mint and transfer a DiLTy token to the specified recipient address', async () => {
        const recipientAddress = '0x9e4aF6FDa84260f957Ff65E1EE447E522C5E0e27';
        const requestBody = { recipientAddress };

        const response = await supertest(server)
            .post('/admin')
            .send(requestBody);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message');

        const message = JSON.parse(response.body.message);
        expect(message).to.deep.equal(requestBody);
    }).timeout(5000);
});
