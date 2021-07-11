// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './ERC1155/IERC1155PresetMinterPauser.sol';

interface ITropixNFT is IERC1155PresetMinterPauser {
  function move(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
  function moveBatch(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external;
}