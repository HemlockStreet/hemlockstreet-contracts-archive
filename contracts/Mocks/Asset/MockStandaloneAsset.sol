// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "../../SkeletonKeyDB/Asset/Asset.sol";

contract MockStandaloneAsset is Asset {
    constructor(address db) Asset(db, address(0)) {}
}
