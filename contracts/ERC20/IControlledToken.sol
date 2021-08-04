// SPDX-License-Identifier: MIT
pragma solidity 0.5.8;

interface IControlledToken {
  function totalSupply() external view returns (uint256);
  function balanceOf(address account) external view returns (uint256);
  function transfer(address recipient, uint256 amount) external returns (bool);
  function allowance(address owner, address spender) external view returns (uint256);
  function approve(address spender, uint256 amount) external returns (bool);
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  function mint(address _to, uint256 _amount) external returns (bool); 
  function forcedTransfer(address _from, address _to, uint256 _value) external returns (bool);
  function forcedBurn(address _who, uint256 _value) external returns (bool);
  function addBurner(address _address) external;
  function addMinter(address _address) external;
  function addOperator(address _address) external;
}