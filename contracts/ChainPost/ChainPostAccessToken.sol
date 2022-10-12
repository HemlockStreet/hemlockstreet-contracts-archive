// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../SkeletonKeyDB/Asset/Implementations/AccessToken.sol";
import "./IChainPostIndexer.sol";

/**
 * @title ChainPostAccessToken
 * @dev Controls the ChainPost Ecosystem
 *
 * @author CyAaron Tai Nava || hemlockStreet.x
 */
contract ChainPostAccessToken is AccessToken {
    string internal _uri;

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }

    function compare(string memory self, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked(self)) ==
            keccak256(abi.encodePacked(b)));
    }

    constructor(
        address db,
        address chainpost,
        string memory uri
    ) AccessToken("ChainPost Access Token - Tier 1", "CPAT-1", db, chainpost) {
        _uri = compare(uri, "")
            ? "ipfs://QmQvYD4LqDdB8gMaVh7vzGfBmApv1kdfGmToQ2B3t2QsU1"
            : uri;
    }

    function _setBaseURI(string memory uri) public RequiredTier(2) {
        _uri = uri;
    }
}
