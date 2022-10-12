// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../Asset.sol";
import "../../ISkeletonKeyDB.sol";

/**
 * @title AccessToken
 * @dev Web3 Access Token Template to be deployed for use with SkeletonKeyDB
 *
 * Make any modifications you desire.
 *
 * @author CyAaron Tai Nava || hemlockStreet.x
 */
abstract contract AccessToken is ERC721, Asset {
    uint internal _tokenIds;

    constructor(
        string memory n,
        string memory s,
        address db,
        address ast
    ) ERC721(n, s) Asset(db, ast) {}

    function _mintTo(address receiver) public RequiredTier(2) returns (uint) {
        _tokenIds++;
        _mint(receiver, _tokenIds);
        return _tokenIds;
    }
}
