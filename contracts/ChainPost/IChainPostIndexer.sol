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

    function supportedTokens() external view returns (uint);

    function supportedFeeds() external view returns (uint);

    function token(uint idx) external view returns (Token memory);

    function priceFeed(uint idx) external view returns (PriceFeed memory);

    function numSupported() external view returns (uint, uint);

    function queryTokenSymbol(string memory sym) external view returns (uint);

    function queryFeedToken(uint assedId, string memory vs)
        external
        view
        returns (uint);

    function queryPair(string memory symbol, string memory vs)
        external
        view
        returns (uint);

    function metadata(uint idx)
        external
        view
        returns (
            address tokenAddress,
            address feedAddress,
            string memory tokenSymbol,
            string memory currencyPair,
            bool defined
        );

    function registerToken(string memory symbol, address addr)
        external
        returns (uint);

    function registerFeed(
        uint assetId,
        string memory vs,
        address addr
    ) external returns (uint);
}
