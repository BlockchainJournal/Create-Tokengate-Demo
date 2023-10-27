const { expect } = require("chai");
const tokenName = "Dilty";

describe(`${tokenName} contract`, function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract(tokenName);

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.getTotalSupply()).to.equal(ownerBalance);
  });

  it("Can mint and transfer DiLTy", async function () {
    console.log('To be implemented')
  });

});
