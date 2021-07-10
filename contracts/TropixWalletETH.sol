// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";


interface IERC20Burn is IERC20 {
  function forcedBurn(address _who, uint256 _value) external returns (bool);
}

contract TropixWalletETH is AccessControlEnumerable {

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  IERC20Burn public tropixETH;

  constructor(address erc20Address) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());

    tropixETH = IERC20Burn(erc20Address);
  }

  receive() external payable  {
  }

  function depositETH() payable public returns (bool) {
      return true;
  }    

  function balanceETH() public view returns (uint256) {
    return address(this).balance;
  }   

  /**
    * @dev msg.sender should have already given the WalletETH an allowance of at least value to use on token.
    */
  function withdrawETH(address payable account, uint256 amount) public {
    require (address(this).balance >= amount, "WalletETH: no ETH balance");
    tropixETH.forcedBurn(account, amount);
    account.transfer(amount);
  }

  function updateTropixETH(address erc20Address) public {
    require(hasRole(ADMIN_ROLE, _msgSender()), "WalletETH: must have admin role to updateTropixETH");
    tropixETH = IERC20Burn(erc20Address);
  }  

}