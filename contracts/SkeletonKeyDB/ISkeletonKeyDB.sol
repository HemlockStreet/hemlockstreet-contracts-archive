// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title ISkeletonKeyDB
 * @dev SkeletonKeyDB Interface
 *
 * @author CyAaron Tai Nava || hemlockStreet.x
 */
interface ISkeletonKeyDB {
    function skeletonKeyHolder(address asset) external view returns (address);

    function executiveKeyHolder(address asset) external view returns (address);

    function adminKeyHolders(address asset)
        external
        view
        returns (address[] memory);

    function isAdminKeyHolder(address asset, address user)
        external
        view
        returns (bool);

    function accessTier(address asset, address holder)
        external
        view
        returns (uint);

    function defineSkeletonKey(
        address asset,
        address token,
        uint id
    ) external;

    function defineExecutiveKey(
        address asset,
        address token,
        uint id
    ) external;

    function defineAdminKey(
        address asset,
        address token,
        uint[] memory ids
    ) external;

    function manageAdmins(
        address asset,
        uint[] memory ids,
        bool grant
    ) external;
}
