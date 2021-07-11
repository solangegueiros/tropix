// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './oz/token/ERC20/presets/ERC20PresetMinterPauser.sol';


contract TropixETH is ERC20PresetMinterPauser {

    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor() ERC20PresetMinterPauser("Tropix ETH", "TropixETH") {
        _setupRole(BURNER_ROLE, _msgSender());
    }

    event ForcedBurn(address requester, address wallet, uint256 value);

    function forcedBurn(address _who, uint256 _value) public returns (bool) {
        require(hasRole(BURNER_ROLE, _msgSender()), "TropixETH: must have burner role to burn");

        _burn(_who, _value);
        emit ForcedBurn(msg.sender, _who, _value);
        return true;
    }
    
}

