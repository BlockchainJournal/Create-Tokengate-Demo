const { expect } = require("chai");
const {deployDiltyContract} = require('../scripts/deploy-dilty')
const { ethers} = require('hardhat');
const tokenName = "Dilty02";

describe(`${tokenName} contract test`, function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {

    let contract = await deployDiltyContract();
    const ownerBalance = await contract.balanceOf(contract.getAddress());
    expect(await contract.getTotalSupply()).to.equal(ownerBalance);
    const contractAddress = await contract.getAddress();
    console.log('Contract address:', contractAddress);

    // Get an instance of the deployed contract
    const contractFactory = await ethers.getContractFactory(tokenName);
    contract = await contractFactory.attach(contractAddress);

    // Get the owner of the contract
    const owner = await contract.owner();

    console.log('Contract owner:', owner);

  });

  it("Can mint and transfer DiLTy", async function () {
    console.log('To be implemented')
  });

});
