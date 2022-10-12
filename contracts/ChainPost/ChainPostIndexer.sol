// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "./IChainPostIndexer.sol";
import "../SkeletonKeyDB/Asset/Asset.sol";

/**
 * @title ChainPostIndexer
 * @dev Standalone Price Feed Database Contract for ChainPost Ecosystem
 *
 * NOT FOR THE END USER, USE THE CHAINPOST CONTRACT INSTEAD
 *
 * @author CyAaron Tai Nava || hemlockStreet.x
 */
contract ChainPostIndexer is IChainPostIndexer, Asset {
    function compareStrings(string memory self, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked(self)) ==
            keccak256(abi.encodePacked(b)));
    }

    mapping(uint => Token) internal _tokens;
    uint internal tokenIds;
    mapping(uint => PriceFeed) internal _priceFeeds;
    uint internal feedIds;

    function supportedTokens() public view override returns (uint tokens) {
        tokens = tokenIds;
    }

    function supportedFeeds() public view override returns (uint feeds) {
        feeds = feedIds;
    }

    constructor(
        string memory symbol,
        address wAddr,
        address pfAddr,
        address db,
        address master
    ) Asset(db, master) {
        tokenIds++;
        _tokens[tokenIds] = Token(symbol, wAddr);
        feedIds++;
        _priceFeeds[feedIds] = PriceFeed(1, "USD", pfAddr);
    }

    function token(uint idx) public view override returns (Token memory) {
        return _tokens[idx];
    }

    function priceFeed(uint idx)
        public
        view
        override
        returns (PriceFeed memory)
    {
        return _priceFeeds[idx];
    }

    function numSupported()
        public
        view
        override
        returns (uint tokens, uint feeds)
    {
        tokens = tokenIds;
        feeds = feedIds;
    }

    function isDefined(PriceFeed memory feed)
        internal
        view
        returns (bool defined)
    {
        defined =
            (feed.addr != address(0)) &&
            (!compareStrings(feed.vs, "")) &&
            (!compareStrings(token(feed.tokenId).symbol, ""));
    }

    function metadata(uint feedId)
        public
        view
        override
        returns (
            address tokenAddress,
            address feedAddress,
            string memory tokenSymbol,
            string memory currencyPair,
            bool defined
        )
    {
        PriceFeed memory pf = priceFeed(feedId);
        Token memory tkn = token(pf.tokenId);
        tokenAddress = tkn.addr;
        feedAddress = pf.addr;
        tokenSymbol = tkn.symbol;
        currencyPair = pf.vs;
        defined = isDefined(pf);
    }

    function queryTokenSymbol(string memory sym)
        public
        view
        override
        returns (uint)
    {
        for (uint i = 0; i <= tokenIds; i++) {
            if (compareStrings(sym, token(i).symbol)) return i;
        }
        return 0;
    }

    function queryFeedToken(uint tokenId, string memory vs)
        public
        view
        override
        returns (uint)
    {
        for (uint i = 0; i <= feedIds; i++) {
            if (
                compareStrings(vs, priceFeed(i).vs) &&
                tokenId == priceFeed(i).tokenId
            ) return i;
        }
        return 0;
    }

    function queryPair(string memory symbol, string memory vs)
        public
        view
        override
        returns (uint feedId)
    {
        uint tokenId = queryTokenSymbol(symbol);
        feedId = queryFeedToken(tokenId, vs);
    }

    // Setters
    function queryTokenAddress(address addr) internal view returns (uint) {
        for (uint i = 0; i <= tokenIds; i++) {
            if (addr == token(i).addr) return i;
        }
        return 0;
    }

    function registerToken(string memory symbol, address addr)
        public
        override
        RequiredTier(1)
        returns (uint successIfNot0)
    {
        uint byAddress = queryTokenAddress(addr);
        uint bySymbol = queryTokenSymbol(symbol);
        uint tokenIdx = (byAddress == bySymbol) ? bySymbol : 0;
        if (tokenIdx == 0) {
            tokenIds++;
            _tokens[tokenIds] = Token(symbol, addr);
        }
        successIfNot0 = tokenIdx;
    }

    function queryFeedAddress(address addr) internal view returns (uint) {
        for (uint i = 0; i <= feedIds; i++) {
            if (addr == priceFeed(i).addr) return i;
        }
        return 0;
    }

    function registerFeed(
        uint tokenId,
        string memory vs,
        address addr
    ) public override RequiredTier(1) returns (uint successIfNot0) {
        uint byAddress = queryFeedAddress(addr);
        uint byPair = queryFeedToken(tokenId, vs);
        uint feedId = (byAddress == byPair) ? byPair : 0;
        if (feedId == 0) {
            feedIds++;
            _priceFeeds[feedIds] = PriceFeed(tokenId, vs, addr);
        }
        successIfNot0 = feedId;
    }

    // function updateToken() public {}
    // function updateFeed() public {}
}
