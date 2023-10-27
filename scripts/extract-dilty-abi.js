const fs = require('fs');
const { artifacts } = require('hardhat');

async function extractABI(contractName) {
  // Compile the smart contract (if not already done)
  if (!artifacts.readArtifactSync(contractName)) {
    await run('compile');
  }

  // Access the contract's ABI
  const contractArtifact = await artifacts.readArtifact(contractName);
  const abi = contractArtifact.abi;

  return abi;
}

// Usage of the extractABI function
async function main() {
  const tokenABI = await extractABI('Dilty'); // Use the contract name, not command-line style options

  // Output the ABI to the console
  console.log(JSON.stringify(tokenABI, null, 2));
}

main();
