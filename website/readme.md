# The Token Gating Demonstration Website

![Under Construction](../errata/under-construction.png)

|For demonstration use only|
|---|
|Be advised that the code in this repository is intended for demonstration purposes only.  It is not intended for use in a production environment.  The code is provided as-is and the author is not responsible for any damages that may result from its use.  The code is provided under the MIT license.|

The purpose of the demonstration website is to show how to use the Dilty smart contract to gate access to a website.  The website is a simple Node.JS application that uses the Express framework.  The website is designed to gate access to a page that displays a list of NFTs.  The website interacts the Dilty smart contract to gate access to the page.

In order get this site up and running, first you must execute the tasks in the [hardhat directory](../hardhat) to upload the graphic associated with the gating NFT to IPFS and then compile and deploy the smart contract to the testnet.  Also, you'll run a script that will actually mint the gating NFT and transfer it to the address of the person being gated.

Once tasks in the [hardhat directory](../hardhat) are complete, you can run the web server to see the demonstration website in action.

Also, be advised the before you can run the website you must have a `.env` file in the root of the website directory.  The `.env` file should contain the following:

```env
INFURA_API_KEY=<Infura key here> // used to access the Seoplia testnet
SEPOLIA_PRIVATE_KEY=<Sepolia private key here> // used to deploy the smart contract to the Seoplia testnet
ALCHEMY_API_KEY=<Alchemy key here> // used by HardHat as the provider to the Sepolia testnet
PINATA_API_KEY=<Pinata API key here>
PINATA_SECRET_API_KEY=<Pinata secret here>
```

# Getting the demonstration website up and running

In the root of the website directory, run the following command to install the necessary packages:

```bash
npm install
```

To start the web server, run the following command:

```bash
npm start
```

#Using the demonstration website

[TO BE PROVIDED]
