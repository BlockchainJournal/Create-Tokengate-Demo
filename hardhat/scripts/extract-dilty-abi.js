const fs = require('fs');
const { artifacts } = require('hardhat');
const {join} = require('path');

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
  const tokenABI = await extractABI('Dilty02'); // Use the contract name, not command-line style options
  const directoryPath = join(__dirname, './data');
  // Create the directory if it doesn't exist
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, {recursive: true});
  }
  const filePath = join(directoryPath, 'dilty-abi.json');


// Create the directory if it doesn't exist
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

// Write the JSON data to the file
  fs.writeFileSync(filePath, JSON.stringify(tokenABI, null, 2));

}

main();
