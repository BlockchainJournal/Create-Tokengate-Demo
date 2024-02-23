# The Token Gating Demonstration Website

![Under Construction](../errata/under-construction.png)

|For demonstration use only|
|---|
|Be advised that the code in this repository is intended for demonstration purposes only.  It is not intended for use in a production environment.  The code is provided as-is and the author is not responsible for any damages that may result from its use.  The code is provided under the MIT license.|

# Working with the demonstration website

Use the code in the [hardhat directory](../hardhat) to compile the code and extract the ABI and bytecode for the smart contract.

# 1.Compiling the contract
 Got to the `hardhat` directory and execute the following command to compile the code:

```bash
 npx hardhat compile
```

# 2. Extracting the ABI

Then, execute the following command to extract the ABI and bytecode for the smart contract:

```bash
 npx hardhat run scripts/extract-dilty-abi.js
```
This will create the JSON file named `dilty-abi.json` that  describes the contract's ABI and store it in the directory `src/contracts`.

# 3. Deploy the contract to the testnet

Execute the following command to deploy the contract to the testnet:

```bash
 npx hardhat run scripts/deploy-dilty.js --network <NETWORK_NAME>
```

WHERE

`NETWORK-NAME` is the name of the network to which you want to deploy the contract.  For example, `sepolia` or `ropsten`.

Where deploying to Sepolia, make sure that the `sepolia` network is defined in the file `hardhat.config.js` as follows:

```javascript
// hardhat.config.js
module.exports = {
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [${SEPOLIA_PRIVATE_KEY}]
        }
    }
};
```


You'll see output similar to the following:

```bash
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Dilty address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Also, output similar to the following will be saved to the file `dilty-address.json` in the directory `src/contracts`.  

```bash
{
  "diltyAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "deployerAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
}
```

The file `dilty-address.json` contains the address of the deployed contract as well as the deployer's address.    These addresses are used by the web server to manage token gating activities/   

# Running the web server

The web server is a Node.JS application that uses the Express framework.  The web server is located in the `website` directory.  

Make sure that the `.env` file is set up with the following environment variables:

```bash
INFURA_API_KEY=<Infura key here>
SEPOLIA_PRIVATE_KEY=<Sepolia private key here>
NFT_STORAGE_KEY=<nft.storage API key here>
```


To run the web server make sure that you are in the `website` directory. Then, execute the following command to start the web server:

```bash
npm start
```

