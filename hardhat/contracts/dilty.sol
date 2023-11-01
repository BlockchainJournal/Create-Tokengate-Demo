//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dilty is ERC721URIStorage, Ownable {
    uint256 private totalSupply;
    mapping(address => uint256) addressTokenIds;

    event Minting(string tokenURI, uint256 tokenId);

    constructor() ERC721("Blockchain Journal DiLTy", "BCJDLT") Ownable(msg.sender) {}

    // Function to add or update an amount for a particular accountAddress
    function setAddressTokenId(address _accountAddress, uint256 _tokenId) private {
        addressTokenIds[_accountAddress] = _tokenId;
    }

    // Function to retrieve an age based on a name
    function getAddressTokenId(address _accountAddress) private view returns (uint256) {
        return addressTokenIds[_accountAddress];
    }


    function mint(string memory _tokenURI) public onlyOwner returns (uint256) {
        totalSupply++;
        uint256 tokenId = totalSupply;
        emit Minting(_tokenURI, tokenId);
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return tokenId;
    }

    /*
      This  method is idempotent. If the _to address already has
      a tokenId, then that tokenId will be returned
      */
    function mintAndTransferSuperDiltyNFT(string calldata _tokenURI, address _to) public returns (uint256) {
        // If the address has a token, then exit the function returning
        // the token address
        if (addressTokenIds[_to] != 0) return addressTokenIds[_to];

        uint256 tokenId = mint(_tokenURI);
        uint256 result;
        bool success = this.transfer(_to);
        if (success) {
            setAddressTokenId(_to, tokenId);
            result = tokenId;
        } else {
            result = 0;
        }
        return result;
    }

    function transfer(address _to) external onlyOwner returns (bool) {
        uint256 amount = 1;
        require(totalSupply >= amount, "Not enough tokens");

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, _to, amount);

        return true;
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
