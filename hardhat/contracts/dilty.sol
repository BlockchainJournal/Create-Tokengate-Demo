//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dilty02 is ERC721URIStorage, Ownable {
    uint256 private totalSupply = 0; //total number of tokens minted
    mapping(address => uint256) addressTokenIds;

    event Minting(string tokenURI, uint256 tokenId);

    constructor() ERC721("Blockchain Journal DiLTy V3", "BCJDLT3") Ownable(msg.sender) {}

    function getAddressTokenId(address _accountAddress) public view returns (uint256) {
        return addressTokenIds[_accountAddress];
    }

    function getNextTokenId() public view returns (uint256) {
        return totalSupply + 1;
    }

    function hasAddress(address addr) public view returns (bool) {
        return addressTokenIds[addr] != 0;
    }

    /*
        * Mints a new token only if the address of _intendedRecipient does not already have one,
        * otherwise the tokenId of the token associated with the address of the _intendedRecipient
        * is returned.
        * @param _tokenURI the URI of the token
        * @param _intendedRecipient the address of the intended recipient of the token being minted
        * @return the tokenId of the minted token
    */
    function mint(string memory _tokenURI, address _intendedRecipient) public onlyOwner returns (uint256) {
        //check if the address already has an transferred token
        if (addressTokenIds[_intendedRecipient] != 0) {
            return addressTokenIds[_intendedRecipient];
        }
        totalSupply++;
        uint256 tokenId = totalSupply;
        emit Minting(_tokenURI, tokenId);
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return tokenId;
    }


    /**
     * Transfer a token to a new address, MUST be called directly after minting
     * @param _to address to transfer the token to
     * @return true if the transfer was successful, false if not
   */
    function transfer(address _to) external onlyOwner returns (bool) {
        //check if the address already has a token
        if (getAddressTokenId(_to) > 0) {
            return false;
        }
        uint256 amount = 1;
        require(totalSupply >= amount, "Not enough totalSupply available. Make sure you use the mint() function to mint a token intended for the recipient before doing the transfer");
        //if not, then transfer the token to the new address
        _transfer(msg.sender, _to, totalSupply);
        addressTokenIds[_to] = totalSupply;
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
