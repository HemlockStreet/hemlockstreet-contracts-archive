// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Contract by CAT6#2699
abstract contract Mock20Base is ERC20 {
    uint standardAmount = 1024 * (10**18);
    uint massAmount = 1000000 * (10**18);

    function quickMint() public {
        _mint(msg.sender, standardAmount);
    }

    function bigMint() public {
        _mint(msg.sender, massAmount);
    }

    function myBalance() public view returns (uint) {
        return balanceOf(msg.sender);
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        quickMint();
    }
}

contract TetherUsd is Mock20Base {
    constructor() Mock20Base("USD Tether", "USDT") {}
}

contract ChainlinkToken is Mock20Base {
    constructor() Mock20Base("Chainlink Token", "LINK") {}
}

contract WrappedEthereum is Mock20Base {
    constructor() Mock20Base("Wrapped Ethereum", "wETH") {}
}

contract WrappedMatic is Mock20Base {
    constructor() Mock20Base("Wrapped Polygon", "wMATIC") {}
}

contract WrappedBitcoin is Mock20Base {
    constructor() Mock20Base("Wrapped Bitcoin", "wBTC") {}
}
