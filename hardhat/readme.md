![Under Construction](../errata/under-construction.png)

|For demonstration use only|
|---|
|Be advised that the code in this respostiory is intended for demonstration purposes only.  It is not intended for use in a production environment.  The code is provided as-is and the author is not responsible for any damages that may result from its use.  The code is provided under the MIT license.|


This Node.JS project contains the Node.Js scripts and HardHat tasks that are used to deploy the smart contract managing NFT creation to the testnet. Also, this directory contains the HardHat task that publishes the NFT to the IPFS.


# Requirements

A computer running Node.JS 18+

# Set up

Clone the source code from GitHub:

```bash
git clone https://github.com/BlockchainJournal/Create-Tokengate-Demo.git
```

Navigate to the working directory of the demonstration project:

```bash
cd Create-Tokengate-Demo
```


Install the dependency libraries

```bash
npm install
```

# Setting up the `.env` file

This project requires values that are set as environment variables. You can set the environment at the project level by defining those variables in a `.env` file in the project's root directory. The structure of the `.env` file is as follows:

```bash
INFURA_API_KEY=<Infura key here>
SEPOLIA_PRIVATE_KEY=<Sepolia private key here>
NFT_STORAGE_KEY=<nft.storage API key here>
```

[MORE TO COME]

# Compiling the project's smart contract

```bash
npx hardhat compile
```

# Confirming the project setup

Run the tests declared in the file `./test/Dilty.js`

```bash
npm test
```

[MORE TO COME]

# Uploading an image to IPFS

```bash
npx hardhat diltyUploadPngToIpfsPinata
```
