# Creating a Token Gate on EVM compatible blockchains.
![Under Construction](./errata/under-construction.png)

The purpose of this repository is to demonstrate how to create a token gate on an EVM compatible blockchain.  The token gate is application logic that restricts user or application behavior based on a user owning a particular NFT.

The folder `hardhat` contains the smart contract and the scripts to deploy the smart contract to the testnet. The smart contract manages token creation. Also, the `hardhat` folder contains the scripts that publishes a graphic for an NFT to the IPFS.

The folder `website` contains logic the restricts user behavior based on the given user's ownership of a generated token. The demonstration website admin feature has logic that creates the NFT that is used to token gate a particular user.

Server side admin code interacts with the smart contract on the blockchain to generate the NFT that is used in the token gating process. The token is then transferred to the user using the admin web page running under the project's web server.  Once the NFT is transferred to the user, that user will have permissions granted by server side logic.

[MORE TO COME]
