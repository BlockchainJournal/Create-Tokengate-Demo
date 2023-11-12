![Under Construction](https://buysellgraphic.com/images/graphic_preview/zip_detail/22482_under_construction_signjpg.jpg)

# Working with the demonstration website

Use Hardhat to compile the code and extract the ABI and bytecode for the smart contract.

# 1.Compiling the contract

In the `hardhat` directory, above execute the following command to compile the code:

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

