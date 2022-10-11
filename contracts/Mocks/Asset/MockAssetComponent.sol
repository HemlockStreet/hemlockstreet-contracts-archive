// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "../../SkeletonKeyDB/Asset/Asset.sol";

contract MockAssetComponent is Asset {
    constructor(address db, address asset) Asset(db, asset) {}
}
