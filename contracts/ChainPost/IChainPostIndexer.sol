// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// Contract by CAT6#2699

interface IChainPostIndexer {
    struct Token {
        string symbol;
        address addr;
    }

    struct PriceFeed {
        uint tokenId;
        string vs;
        address addr;
    }

    function token(uint idx) external view returns (Token memory);

    function priceFeed(uint idx) external view returns (PriceFeed memory);

    function numSupported() external view returns (uint, uint);

    function queryTokenSymbol(string memory sym) external view returns (uint);

    function queryFeedToken(uint assedId, string memory vs)
        external
        view
        returns (uint);

    function metadata(uint idx)
        external
        view
        returns (
            PriceFeed memory feed,
            Token memory underlying,
            bool native,
            bool defined
        );
}
