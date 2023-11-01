const {infuraUrl} = require("../hardhat.config.js");

async function searchContract() {
    try {
        const contractAddress = "0x6Da8954c259f0D10638e7c9ab4178061A25a6723";
        const contractABI = require("./dilty-abi.json");

        const provider = ethers.getDefaultProvider(infuraUrl);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const contractName = await contract.name(); // Replace with the actual function you want to call
        console.log("Contract Name:", contractName);

        // Add more interactions with the contract if needed
        // For example, you can call other functions or retrieve contract data here

    } catch (error) {
        console.error("Error searching for the contract:", error);
    }
}

searchContract();
