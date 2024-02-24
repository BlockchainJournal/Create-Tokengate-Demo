# Creating a Token Gate on EVM compatible blockchains.
![Under Construction](./errata/under-construction.png)

|For demonstration use only|
|---|
|Be advised that the code in this repository is intended for demonstration purposes only.  It is not intended for use in a production environment.  The code is provided as-is and the author is not responsible for any damages that may result from its use.  The code is provided under the MIT license.|


The purpose of this repository is to demonstrate how to implement a token gate using a NFT that's stored on an EVM compatible blockchain.  A token gate is application logic that restricts user or application behavior based on a given user owning a particular NFT.


The folder `hardhat` contains the smart contract and the scripts to deploy the smart contract to the testnet. The smart contract manages token creation. Also, the `hardhat` folder contains the script that publishes a graphic for an NFT to the IPFS.

The folder `website` contains logic the restricts user behavior based on the given user's ownership of a generated token. The demonstration website admin feature has logic that interacts with server-side code to create the NFT that is used to token gate a particular user.

The general workflow is shown in the figure below.

![General Workflow](./errata/general-workflow-02.png)

Server side admin code interacts with the smart contract on the blockchain to generate the NFT that is used in the token gating process. The token is then transferred to the user using the admin web page running under the project's web server.  Once the NFT is transferred to the user, that user will have permissions granted by server side logic.

The way the website works is that the user logs in using MetaMask as the authentication mechanism. Behind the scenes, the web server checks the smart contract on the EVM compatible blockchain, asking the contract if the user (by address) was issued an NFT. (The smart contract has custom logic that keeps track of the user addresses to which its NFTs have been assigned). If the user has the NFT, that fact is reported to the calling web page and the web page executes a behavior tha is special to the given owner of the NFT. (See the figure below.)

![General Workflow](./errata/webserver-01.png)
