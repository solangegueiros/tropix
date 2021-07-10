// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IOkenNFT {
  event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
  event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
  event ApprovalForAll(address indexed account, address indexed operator, bool approved);
  event URI(string value, uint256 indexed id);
  function balanceOf(address account, uint256 id) external view returns (uint256);
  function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory);
  function setApprovalForAll(address operator, bool approved) external;
  function isApprovedForAll(address account, address operator) external view returns (bool);
  function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
  function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external;

  function burn(address account, uint256 id, uint256 value) external;
  function burnBatch(address account, uint256[] calldata ids, uint256[] calldata values) external;
  function mint(address to, uint256 id, uint256 amount, bytes calldata data) external;
  function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external;
  function pause() external;
  function paused() external view returns (bool);
  function unpause() external;

  function hasRole(bytes32 role, address account) external view returns (bool);
  function getRoleAdmin(bytes32 role) external view returns (bytes32);
  function grantRole(bytes32 role, address account) external;
  function revokeRole(bytes32 role, address account) external;
  function renounceRole(bytes32 role, address account) external;

  function move(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
  function moveBatch(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external;
}