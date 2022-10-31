// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IRejectableNFT is IERC721 {
    /**
     * @dev Emitted when `tokenId` token is tried to be transferred from `from` sender to `to` receiver.
     */
    event TransferRequest(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    /**
     * @dev Emitted when receiver `to` rejects `tokenId` transfer from `from` to `to`.
     */
    event RejectTransferRequest(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    /**
     * @dev Emitted when sender `from` cancels `tokenId` transfer `from` to `to`.
     */
    event CancelTransferRequest(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    function transferableOwnerOf(uint256 tokenId)
        external
        view
        returns (address);

    function acceptTransfer(uint256 tokenId) external;

    function rejectTransfer(uint256 tokenId) external;

    function cancelTransfer(uint256 tokenId) external;
}
