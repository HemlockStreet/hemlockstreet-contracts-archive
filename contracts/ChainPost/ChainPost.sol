// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../SkeletonKeyDB/Asset/Asset.sol";
import "./IChainPostIndexer.sol";
import "./IPriceConverter.sol";

/**
 * @title ChainPost
 * @dev Main ChainPost Contract
 *
 * Coordinates the i/o of the Indexer & Administrative Panel Contract
 *
 * @author CyAaron Tai Nava || hemlockStreet.x
 */
contract ChainPost is Asset {
    address public _indexer;
    address public _converter;
    IChainPostIndexer indexer;
    IPriceConverter converter;

    constructor(address db, address cnvrt) Asset(db, address(0)) {
        converter = IPriceConverter(cnvrt);
        _converter = cnvrt;
    }

    function setIndexer(address addr) public RequiredTier(2) {
        indexer = IChainPostIndexer(addr);
        _indexer = addr;
    }

    function setConverter(address addr) public RequiredTier(2) {
        converter = IPriceConverter(addr);
        _converter = addr;
    }

    function numSupported() public view returns (uint tokens, uint feeds) {
        (tokens, feeds) = indexer.numSupported();
    }

    function findPair(string memory symbol, string memory vs)
        public
        view
        returns (uint feedId)
    {
        uint tokenId = indexer.queryTokenSymbol(symbol);
        feedId = indexer.queryFeedToken(tokenId, vs);
    }

    function metadata(uint idx)
        public
        view
        returns (IERC20 token, AggregatorV3Interface feed)
    {
        token = IERC20(indexer.token(idx).addr);
        feed = AggregatorV3Interface(indexer.priceFeed(idx).addr);
    }
}
