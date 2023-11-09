const {infuraUrl} = require("../hardhat.config.js");
const fs = require("fs");
const {join} = require("path");
const  {ethers, JsonRpcProvider} = require("ethers");

async function searchContract() {
    try {
        const directoryPath = join(__dirname, './data');
        const filePath = join(directoryPath, 'dilty-addresses.json');
        const json = fs.readFileSync(filePath, 'utf8');
        const contractAddress = JSON.parse(json).diltyAddress;
        const contractABI = require("./data/dilty-abi.json");

        const provider = new JsonRpcProvider(infuraUrl);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const contractName = await contract.name();
        console.log("Contract Name:", contractName);
        const nextTokenId = await contract.getNextTokenId();
        console.log("Next Token ID:", nextTokenId.toString());
    } catch (error) {
        console.error("Error searching for the contract:", error);
    }
}

searchContract();
