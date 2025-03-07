// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {

    // Star data
    struct Star {
        string name;
    }

    // ✅ Implement Task 1 Add a name and symbol properties
    constructor() ERC721("StarNotaryToken", "SNT") {}

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;


    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public {// Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name);
        // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar;
        // Creating in memory the Star -> tokenId mapping
        _safeMint(msg.sender, _tokenId);
        // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't owned");
        starsForSale[_tokenId] = _price;
    }

    // Function that allows you to convert an address into a payable address
    function _make_payable(address genericAddress) internal pure returns (address payable) {
        return payable(genericAddress);
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        _safeTransfer(ownerAddress, msg.sender, _tokenId, "");
        address payable ownerAddressPayable = _make_payable(ownerAddress);
        // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        if (msg.value > starCost) {
            _make_payable(msg.sender).transfer(msg.value - starCost);
        }
    }

    // ✅ Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo(uint _tokenId) public view returns (string memory) {
        return tokenIdToStarInfo[_tokenId].name;
    }

    // ✅ Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        address owner1 = ERC721.ownerOf(_tokenId1);
        address owner2 = ERC721.ownerOf(_tokenId2);
        require(owner1 == msg.sender || owner2 == msg.sender);
        _safeTransfer(owner1, owner2, _tokenId1, "token transfer from 1 to 2");
        _safeTransfer(owner2, owner1, _tokenId2, "token transfer from 2 to 1");
    }

    // ✅ Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        require(ERC721.ownerOf(_tokenId) == msg.sender);
        _safeTransfer(msg.sender, _to1, _tokenId, "token transfer");
    }

}