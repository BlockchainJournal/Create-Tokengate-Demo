const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sigUtil = require('@metamask/eth-sig-util');
const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');
const {path, join} = require('path');
const fs = require('fs');
const {mintAndTransfer, getTokenId, getContractAndOwnerAddresses, getTokenUriJson} = require('./lib/contractHelpers');

app.use(bodyParser.json());
const dotenv = require('dotenv');
dotenv.config({ debug: true });
// Replace this with your own secret key (used to sign JWT tokens)
const secretKey = 'w87LqcTUMeA7U8v@#yEEZX2KfH@G9mWxxx';

// Mock user database (you should use a real database)
const users = [];
const profiles = [];

/**
 * Helper function that generates the a JWT token
 * @param senderAddress, user's account address
 * @returns {string}
 */
function generateAuthToken(senderAddress) {
    const token = jwt.sign({senderAddress}, secretKey, {expiresIn: '1h'});
    return `Bearer ${token}`;
}

/**
 * This is a courtesy function that demonstrates
 * how to extract a sender's address from a public
 * key
 * @param hexPublicKey, the public key as a hexadecimal string
 * @returns {string} the sender's address as a hexadecimal string
 */
const getAddress = (hexPublicKey) => {
    // Remove the '0x' prefix
    const publicKeyWithoutPrefix = hexPublicKey.slice(2);
    // Split the public key into X and Y coordinates (each coordinate is 64 characters)
    const xCoord = publicKeyWithoutPrefix.slice(0, 64);
    const yCoord = publicKeyWithoutPrefix.slice(64);
    // Concatenate the X and Y coordinates
    const concatenatedCoords = xCoord + yCoord;
    // Convert the concatenation to a buffer
    const bufferCoords = Buffer.from(concatenatedCoords, 'hex');
    // Hash the concatenated coordinates using Keccak-256
    const hashedCoords = ethUtil.keccak(bufferCoords, 256);
    // Convert the result to a hexadecimal string
    const hexString = '0x' + hashedCoords.toString('hex');
    // Slice off the last 40 hexadecimal characters which is the address
    return hexString.slice(-40);
}

/**
 *  Verifies JWT token submitted in req.headers.authorization
 * @param req, HTTP Request in play
 * @param res, HTTP Response that will be emitted by app
 * @returns {Promise<userDate>}
 */
async function verifyJwtToken(req, res) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) return res.status(401).json({error: 'Authorization header missing'});

    const tokenParts = authorizationHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({error: 'Invalid Authorization header format'});
    }

    const jwtToken = tokenParts[1];
    let decoded;
    try {
        decoded = await jwt.verify(jwtToken, secretKey);
    } catch (e) {
        return res.status(401).json({error: e.message});
    }
    // Access decoded data (user information)
    const userData = decoded;

    // Process the data as needed
    console.log('Decoded User Data:', userData);
    return userData
}

/**
 * Middleware to verify MetaMask signature
 * @param req, HTTP Request in play
 * @param res, HTTP Response that will be emitted by app
 * @param next, the next middeleware function to call
 * @returns {*} calls next() upon success, raises a 401 on failure
 */
function verifySignature(req, res, next) {
    const {address, signature, message} = req.body;
    const publicKey = sigUtil.extractPublicKey({
        data: message,
        signature: signature,
    })
    // This is called for demonstration purposes
    const extractedAddress = getAddress(publicKey);
    console.log(`The sender's address is: ${extractedAddress}`);

    const senderAddress = sigUtil.recoverPersonalSignature({
        data: message,
        signature: signature,
    });
    if (senderAddress.toLowerCase() === address.toLowerCase()) {
        // store the user's address, if its not there already
        if (!users.includes(senderAddress.toLowerCase())) {
            // Add the user's address to the array simulating a DB.
            users.push(senderAddress.toLowerCase());
        }
        // Assert that the signature is valid
        req.senderAddress = senderAddress;
        return next();
    } else {
        return res.status(401).json({error: 'Invalid signature'});
    }
}

// Serve static files from the 'public' folder
app.use(express.static(join(__dirname, 'public')));

/**
 * Route for handling MetaMask login
 */
app.post('/login', verifySignature, (req, res) => {
    const {senderAddress} = req;
    // Check if the user is already registered
    if (users.includes(senderAddress.toLowerCase())) {
        // User exists, generate a JWT token (you should use a real authentication library)
        const jwtToken = generateAuthToken(senderAddress);
        // Check to see if the sender address is a known profile.
        let profile;
        const matchingProfile = profiles.find(obj => obj.address === senderAddress);
        if (matchingProfile) profile = {firstName, lastName, email} = matchingProfile;
        return res.status(200).json({jwtToken, address: senderAddress, profile});
        //return res.json({ token });
    } else {
        // User is not registered, you may choose to register them
        return res.status(401).json({error: 'User not registered'});
    }
});

/**
 * endpoint to retrieve token gating by user
 */
app.get('/token/:userAddress', async (req, res) => {
    const tokenData = await verifyJwtToken(req, res)
    // get the user address from the request URL
    const userAddress = req.params.userAddress;

    // verify that the user owns the token
    try {
        const tokenId = await getTokenId(userAddress);
        const tokenUriJson = await getTokenUriJson(tokenId);
        res.status(200).json(tokenUriJson)
    } catch (e) {
        res.status(401).json({error: e.message})
    }
});


/**
 * Route for handling MetaMask login
 */
app.post('/profile', async (req, res) => {
    const tokenData = await verifyJwtToken(req, res)
    // Check if the user is already registered
    if (users.includes(tokenData.senderAddress.toLowerCase())) {
        const {firstName, lastName, email} = req.body;
        if (!profiles.some(obj => obj.address === tokenData.senderAddress)) {
            profiles.push({
                address: tokenData.senderAddress,
                firstName,
                lastName,
                email
            })
            return res.status(200).json("ok");
        } else {
            return res.status(201).json("ok");
        }
    } else {
        // User is not registered, you may choose to register them
        return res.status(401).json({error: 'Invalid authentication'});
    }
});



// Define a route to serve the 'index.html' file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define a route to serve the 'index.html' file
app.get('/admin', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'admin.html'));
});

// Define a route to serve the 'index.html' file
app.get('/contract', async (req, res) => {
    // return the JSON by calling the function getContractAndOwnerAddresses()
    const json = await getContractAndOwnerAddresses();
    res.status(200).json(json);
});

// Define a route to serve the 'index.html' file
app.post('/admin', async (req, res) => {
    // Do the token transfer against the EVM blockchain
    //console.log(req.body);
    const result = await mintAndTransfer(req.body.recipientAddress);
    return res.status(200).json({message: JSON.stringify(req.body, null, 2)});
});

const PORT = process.env.PORT || 3111;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = {server};
