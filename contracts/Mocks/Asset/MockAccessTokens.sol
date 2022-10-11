// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "../../SkeletonKeyDB/Asset/Implementations/Web2AccessToken.sol";
import "../../SkeletonKeyDB/Asset/Implementations/AccessToken.sol";

contract MockWeb2AccessToken is Web2AccessToken {
    constructor(address db) Web2AccessToken("MW2AT", "W2", db) {}
}

contract MockWeb3AccessToken is AccessToken {
    constructor(address db, address ast) AccessToken("MW3AT", "W3", db, ast) {}
}
