//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dilty is ERC721URIStorage, Ownable {
    uint256 private totalSupply;

    constructor() ERC721("Blockchain Journal DiLTy", "BCJDLT") Ownable(msg.sender) {}

    function mint(string memory tokenURI) public returns (uint256) {
        totalSupply++;
        uint256 tokenId = totalSupply;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function mintSuperDiltyNFT() public returns (uint256) {
        // Upload the PNG file to a decentralized storage platform, such as IPFS.
        // Get the IPFS hash of the PNG file.
        string memory tokenURI = "https://ipfs.io/ipfs/<IPFS_HASH>";
        return mint(tokenURI);
    }

    function transfer(address to, uint256 amount) external {

        require(totalSupply >= amount, "Not enough tokens");
        // Transfer the amount.
        totalSupply -= amount;

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, to, amount);
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function getTotalSupply() external view returns (uint256) {
        return totalSupply;
    }
}
