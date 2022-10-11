// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "../ISkeletonKeyDB.sol";
import "./IAsset.sol";

/**
 * @title Asset
 * @dev Standalone Asset template for SkeletonKeyDB compatibility
 *
 * @author CyAaron Tai Nava || hemlockStreet.x
 */

abstract contract Asset is IAsset {
    address private _deployer;
    address private _skdb;
    address private _asset;

    /**
     * @dev Constructor
     *
     * @param db SkeletonKeyDB address
     *
     * @param asset Javascript `==` logic applies. (falsy & truthy values)
     * Use `address(0)` for standalone assets (typically Web2-based) assets.
     * Use actual asset address otherwise
     */
    constructor(address db, address asset) {
        _skdb = db;
        _deployer = msg.sender;
        bool standalone = asset == address(0);
        _asset = standalone ? address(this) : asset;
    }

    function _skdbMetadata()
        public
        view
        override
        returns (
            address asset,
            address skdb,
            address deployer
        )
    {
        asset = _asset;
        skdb = _skdb;
        deployer = _deployer;
    }

    modifier RequiredTier(uint tier) {
        ISkeletonKeyDB db = ISkeletonKeyDB(_skdb);
        require(db.accessTier(_asset, msg.sender) >= tier, "!Authorized");
        _;
    }

    function _setSkdb(address newDb) public override RequiredTier(3) {
        _skdb = newDb;
    }

    function _setAsset(address newAst) public override RequiredTier(3) {
        require((newAst != _asset) && (_asset != address(this)), "disabled");
        _asset = newAst;
    }
}
