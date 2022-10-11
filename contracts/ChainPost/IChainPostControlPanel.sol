// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// Contract by CAT6#2699

interface IChainPostControlPanel {
    function registerToken(string memory symbol, address addr)
        external
        returns (uint);

    function registerFeed(
        uint assetId,
        string memory vs,
        address addr
    ) external returns (uint);
}
