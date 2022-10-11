// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title IAsset
 * @dev Standard Asset Interface for SkeletonKeyDB
 *
 * @author CyAaron Tai Nava || hemlockStreet.x
 */
interface IAsset {
    function _skdbMetadata()
        external
        view
        returns (
            address asset,
            address skdb,
            address deployer
        );

    function _setSkdb(address newDb) external;

    function _setAsset(address newAst) external;
}
