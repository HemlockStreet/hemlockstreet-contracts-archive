// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../Asset.sol";

/**
 * @title Web2AccessToken
 * @dev Web2 Access Token Template to be deployed for use with SkeletonKeyDB
 *
 * Make any modifications you desire.
 *
 * @author CyAaron Tai Nava || hemlockStreet.x
 */
abstract contract Web2AccessToken is ERC721, Asset {
    uint internal _tokenIds;

    constructor(
        string memory label,
        string memory sym,
        address db
    ) ERC721(label, sym) Asset(db, address(0)) {}

    function mintTo(address receiver) public RequiredTier(2) returns (uint) {
        _tokenIds++;
        _mint(receiver, _tokenIds);
        return _tokenIds;
    }
}
