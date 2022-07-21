// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title  SoulBound Token
/// @author Miquel A. Cabot
/// @dev    Following the design of https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763
contract SBT is ERC721URIStorage {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    address owner;
    Counters.Counter private _tokenIds;
    mapping(address => bool) public issuedSBT;
    mapping(address => string) public accountToURI;

    constructor() ERC721("Soulbound Token", "SBT") {
      owner = msg.sender;
    }

    function issueSBT(address to) external onlyOwner {
        require(!issuedSBT[to], "Token already issued");
        issuedSBT[to] = true;
    }

    function claimSBT(string memory tokenURI) public returns (uint256) {
      require(issuedSBT[msg.sender], "Token not issued");
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();
      _mint(msg.sender, newTokenId);

      issuedSBT[msg.sender] = false;
      accountToURI[msg.sender] = tokenURI;

      return newTokenId;
    }

    modifier onlyOwner() {
      require(msg.sender == owner, "Only the owner can call this function");
      _;
    }
}
