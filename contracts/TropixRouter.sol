// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './oz/token/ERC20/IERC20.sol';
import "./oz/access/AccessControlEnumerable.sol";
import './ITropixNFT.sol';


contract TropixRouter is AccessControlEnumerable {

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  uint256 public constant decimalpercent = 1000000; //100.0000 = percentage accuracy (4) to 100%
  uint256 public constant maxValue = type(uint256).max / decimalpercent;  

  IERC20 public tropixETH;
  ITropixNFT public tropixNFT;

  constructor(address erc20Address, address nftAddress) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());

    tropixETH = IERC20(erc20Address);
    tropixNFT = ITropixNFT(nftAddress);
  }

  function mintNFT(address to, uint256 id, uint256 amount, bytes memory data) public {
    //require(!idExists[id], "id exists");
    //idList.push(id);
    tropixNFT.mint(to, id, amount, data);
    //idExists[id] = true;
  }

  /**
    * @dev msg.sender should have already given the PaymentSplitter an allowance of at least value to split on token.
    * This contract must be tropixNFT operator
    */
  function split (uint256 idNFT, uint256 amountNFT, uint256 value, address buyer, address seller, address[] memory tos, uint256[] memory shares) public {
    require(tos.length == shares.length, "PaymentSplitter: tos and shares length mismatch");
    require(tos.length > 0, "PaymentSplitter: no destinataries");
    require(value > 0, "PaymentSplitter: zero value");
    require(value <= maxValue, "PaymentSplitter: value overflow");

    uint256 totalShare = 0;
    for (uint256 i = 0; i < shares.length; i++) {
      totalShare += shares[i];
    }
    require(totalShare == decimalpercent, "PaymentSplitter: totalShare is NOT 100");

    safeTransferFrom(buyer, address(this), value);

    uint256 totalSent = 0;
    if (tos.length > 1) {
      for (uint256 i = 1; i < tos.length; i++) {
        uint256 valueAux = value * shares[i] / totalShare;
        safeTransfer(tos[i], valueAux);
        totalSent += valueAux;
      }
    }
    //To prevent any balance remaining in the contract
    safeTransfer(tos[0], (value - totalSent));

    tropixNFT.move(seller, buyer, idNFT, amountNFT, "" );
  }

  function safeTransfer(address to, uint value) internal {
    // bytes4(keccak256(bytes('transfer(address,uint256)')));
    (bool success, bytes memory data) = address(tropixETH).call(abi.encodeWithSelector(0xa9059cbb, to, value));
    require(success && (data.length == 0 || abi.decode(data, (bool))), 'TropixRouter: safeTransfer failed');
  }

  function safeTransferFrom(address from, address to, uint value) internal {
    // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
    (bool success, bytes memory data) = address(tropixETH).call(abi.encodeWithSelector(0x23b872dd, from, to, value));
    require(success && (data.length == 0 || abi.decode(data, (bool))), 'TropixRouter: safeTransferFrom failed');
  }

  function updateTropixETH(address erc20Address) public {
    require(hasRole(ADMIN_ROLE, _msgSender()), "TropixRouter: must have admin role to updateTropixETH");
    tropixETH = IERC20(erc20Address);
  }

  function updateTropixNFT(address nftAddress) public {
    require(hasRole(ADMIN_ROLE, _msgSender()), "TropixRouter: must have admin role to updateTropixNFT");
    tropixNFT = ITropixNFT(nftAddress);
  }

}
