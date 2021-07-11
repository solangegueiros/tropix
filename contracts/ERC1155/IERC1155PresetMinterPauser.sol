// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../oz/token/ERC1155/IERC1155.sol";

interface IERC1155PresetMinterPauser is IERC1155 {
    function burn(address account, uint256 id, uint256 value) external;
    function burnBatch(address account, uint256[] calldata ids, uint256[] calldata values) external;
    function mint(address to, uint256 id, uint256 amount, bytes calldata data) external;
    function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external;
    function pause() external;
    function paused() external view returns (bool);
    function unpause() external;
}