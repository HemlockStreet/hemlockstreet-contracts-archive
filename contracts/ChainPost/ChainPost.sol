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

    constructor(address db, address cnvrt) Asset(db, address(0)) {
        _converter = cnvrt;
    }

    function _setIndexer(address addr) public RequiredTier(2) {
        _indexer = addr;
    }

    function _setConverter(address addr) public RequiredTier(2) {
        _converter = addr;
    }

    function numSupported() public view returns (uint tokens, uint feeds) {
        (tokens, feeds) = IChainPostIndexer(_indexer).numSupported();
    }

    function findPair(string memory symbol, string memory basePair)
        public
        view
        returns (address tknAddr, address pfAddr)
    {
        IChainPostIndexer indexer = IChainPostIndexer(_indexer);

        uint idx = indexer.queryPair(symbol, basePair);
        (tknAddr, pfAddr, , , ) = indexer.metadata(idx);
    }
}
