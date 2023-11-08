//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dilty is ERC721URIStorage, Ownable {
    uint256 private totalSupply;
    mapping(address => uint256) addressTokenIds;
    uint256 private nextTokenId = 0;
    event Minting(string tokenURI, uint256 tokenId);

    constructor() ERC721("Blockchain Journal DiLTy", "BCJDLT") Ownable(msg.sender) {}

    // Function to add or update an amount for a particular accountAddress
    function setAddressTokenId(address _accountAddress, uint256 _tokenId) private {
        addressTokenIds[_accountAddress] = _tokenId;
    }

    function getAddressTokenId(address _accountAddress) public view returns (uint256) {
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


    function transfer(address _to) external onlyOwner returns (bool) {
        //check if the address already has a token
        if(getAddressTokenId(_to) != 0) {
            return false;
        }
        uint256 amount = 1;
        require(totalSupply >= amount, "Not enough tokens");
        nextTokenId++;
        //if not, then transfer the token to the new address
        _transfer(msg.sender, _to, nextTokenId);
        setAddressTokenId(_to, nextTokenId);
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
