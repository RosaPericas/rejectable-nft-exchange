// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title  Rejectable NFT
/// @author Miquel A. Cabot
/// @dev    ERC-721 compatible NFT token that can be rejected by the receiver of the transfer function
contract RejectableNFT {
    using SafeMath for uint256;
}
