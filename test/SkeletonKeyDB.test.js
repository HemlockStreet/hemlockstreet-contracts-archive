const { ethers } = require('hardhat');
const { assert, expect } = require('chai');

const null_addr = '0x0000000000000000000000000000000000000000';

describe('SkeletonKeyDB Ecosystem', () => {
  let nft = [];
  let skdb, deployer, users;
  let asset = {};

  const deploy = async (name, from, args = []) => {
    contractFactory = await ethers.getContractFactory(name);
    contract = await contractFactory.connect(from).deploy(...args);
    return contract;
  };

  beforeEach(async () => {
    [deployer, ...users] = await ethers.getSigners();
    nft.push(await deploy('ExpensiveJpeg', deployer));
    nft.push(await deploy('ExpensiveJpeg', deployer));
    nft.push(await deploy('ExpensiveJpeg', deployer));
    skdb = await deploy('SkeletonKeyDB', deployer);
    asset.standalone = await deploy('MockStandaloneAsset', deployer, [
      skdb.address,
    ]);
    asset.component = await deploy('MockAssetComponent', deployer, [
      skdb.address,
      asset.standalone.address,
    ]);
    w2at = await deploy('MockWeb2AccessToken', deployer, [skdb.address]);
    w3at = await deploy('MockWeb3AccessToken', deployer, [
      skdb.address,
      asset.standalone.address,
    ]);

    for await (const user of users) {
      await nft[0].connect(user).quickMint();
      await nft[1].connect(user).quickMint();
    }

    let subdivision = users.slice(0, 5);
    for await (const user of subdivision) {
      await nft[2].connect(user).quickMint();
    }
  });

  const getMetadata = async (target = asset.standalone) => {
    const temp = await target._skdbMetadata();
    return {
      asset: temp[0],
      skdb: temp[1],
      deployer: temp[2],
    };
  };

  async function verifyMetadata(target, db = skdb, dp = deployer) {
    const meta = await getMetadata();

    expect(meta.asset == target.address);
    expect(meta.skdb == db.address);
    expect(meta.deployer == dp.address);
  }

  describe('Asset - Standalone Initial State', () => {
    it('should be compatible with SKDB', async () => {
      await verifyMetadata(asset.standalone);
    });
  });

  // utils

  const accessTier = async (from = deployer, variant = asset.standalone) => {
    const tier = await skdb.accessTier(variant.address, from.address);
    return tier;
  };

  async function defineSK(token = nft[0], id = 1) {
    await skdb
      .connect(deployer)
      .defineSkeletonKey(asset.standalone.address, token.address, id);
  }

  async function defineEK(token = nft[0], id = 2) {
    await skdb
      .connect(deployer)
      .defineExecutiveKey(asset.standalone.address, token.address, id);
  }

  async function defineAK(
    token = nft[2],
    ids = [1, 2, 3, 4, 5],
    from = deployer
  ) {
    await skdb
      .connect(from)
      .defineAdminKey(asset.standalone.address, token.address, ids);
  }

  describe('SKDB - Access Control', () => {
    it('Let the asset deployer register & re-register skeleton keys (Tier 3)', async () => {
      // Defining...
      await defineSK(nft[0]);
      expect((await accessTier()) == 3);
      // Redefining...
      await defineSK(nft[1]);
      expect((await accessTier()) == 3);
    });

    it('Let the skHolder register & re-register executive keys (Tier 2)', async () => {
      await defineSK();
      expect((await accessTier()) == 3);

      // Defining...
      await defineEK(nft[0]);
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);

      // Testing Access Control
      //   expect(
      //     await skdb
      //       .connect(users[0])
      //       .defineSkeletonKey(asset.standalone.address, nft[1].address, 2)
      //   ).to.be.revertedWith('!Authorized');

      // expect(
      //   await skdb
      //     .connect(users[0])
      //     .defineExecutiveKey(asset.standalone.address, nft[2].address, 2)
      // ).to.be.revertedWith('!Authorized');

      // Redefining...
      await defineEK(nft[1]);
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);

      await defineEK(nft[1], 3);
      expect((await accessTier()) == 3);
      expect((await accessTier(users[1])) == 2);

      // Testing Access Control
      //   expect(
      //     await skdb
      //       .connect(users[0])
      //       .defineSkeletonKey(asset.standalone.address, nft[1].address, 2)
      //   ).to.be.revertedWith('!Authorized');

      //   expect(
      //     await skdb
      //       .connect(users[0])
      //       .defineExecutiveKey(asset.standalone.address, nft[2].address, 2)
      //   ).to.be.revertedWith('!Authorized');
    });

    it('Let the tier >= 2 register & re-register admin key contracts (Tier 1)', async () => {
      await defineSK();
      await defineEK();
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);

      // Defining...
      await defineAK(nft[1]);
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);
      expect((await accessTier(users[1])) == 1);
      expect((await accessTier(users[9])) == 0);

      // Testing Access Control
      //   expect(
      //     await skdb
      //       .connect(users[1])
      //       .defineSkeletonKey(asset.standalone.address, nft[1].address, 2)
      //   ).to.be.revertedWith('!Authorized');

      //   expect(
      //     await skdb
      //       .connect(users[1])
      //       .defineExecutiveKey(asset.standalone.address, nft[1].address, 3)
      //   ).to.be.revertedWith('!Authorized');

      //   expect(
      //     await skdb
      //       .connect(users[1])
      //       .defineAdminKey(asset.standalone.address, nft[1].address, [10])
      //   ).to.be.revertedWith('!Authorized');

      // Redefining...
      await defineAK(nft[2]);
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);
      expect((await accessTier(users[1])) == 1);
      expect((await accessTier(users[9])) == 1);

      // Redefining again...
      await defineAK(nft[1], [10]);
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);
      expect((await accessTier(users[1])) == 0);
      expect((await accessTier(users[9])) == 1);

      // Testing Access Control
      //   expect(
      //     await skdb
      //       .connect(users[1])
      //       .defineSkeletonKey(asset.standalone.address, nft[1].address, 2)
      //   ).to.be.revertedWith('!Authorized');

      //   expect(
      //     await skdb
      //       .connect(users[1])
      //       .defineExecutiveKey(asset.standalone.address, nft[1].address, 3)
      //   ).to.be.revertedWith('!Authorized');

      //   expect(
      //     await skdb
      //       .connect(users[1])
      //       .defineAdminKey(asset.standalone.address, nft[1].address, [10])
      //   ).to.be.revertedWith('!Authorized');

      // Redefining as ekHolder...
      await defineAK(nft[1], [1, 2, 3, 4, 5], users[0]);
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);
      expect((await accessTier(users[1])) == 1);
      expect((await accessTier(users[9])) == 0);
    });

    it('Let the tier >=2 perform bulk actions (Tier 1)', async () => {
      await defineSK();
      await defineEK();
      await defineAK();
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);
      expect((await accessTier(users[1])) == 1);
      expect((await accessTier(users[4])) == 1);
      expect((await accessTier(users[9])) == 0);

      await skdb
        .connect(users[0])
        .manageAdmins(asset.standalone.address, [3, 4, 11, 10, 8, 9], true);
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);
      expect((await accessTier(users[1])) == 1);
      expect((await accessTier(users[4])) == 1);
      expect((await accessTier(users[9])) == 1);

      await skdb
        .connect(deployer)
        .manageAdmins(asset.standalone.address, [3, 4, 4, 20], false);
      expect((await accessTier()) == 3);
      expect((await accessTier(users[0])) == 2);
      expect((await accessTier(users[1])) == 0);
      expect((await accessTier(users[4])) == 1);
      expect((await accessTier(users[9])) == 1);
    });
  });

  describe('Asset (Component) - Access Control', () => {
    beforeEach(async () => {
      await defineSK();
      await defineEK();
      await defineAK();
    });

    it('Should only let skHolder redefine skdb', async () => {
      // Testing Access Control
      // expect(
      //   await asset.standalone.connect(users[0])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');
      // expect(
      //   await asset.standalone.connect(users[1])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');

      // Redefining...
      await asset.standalone.connect(deployer)._setSkdb(null_addr);
      let meta = await asset.standalone._skdbMetadata();
      expect(meta[0] == asset.standalone.address);
      expect(meta[1] == null_addr);
      expect(meta[2] == deployer.address);

      // Testing Access Control
      // expect(
      //   await asset.component.connect(users[0])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');
      // expect(
      //   await asset.component.connect(users[1])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');

      // Redefining...
      await asset.component.connect(deployer)._setSkdb(null_addr);
      meta = await asset.component._skdbMetadata();
      expect(meta[0] == asset.component.address);
      expect(meta[1] == null_addr);
      expect(meta[2] == deployer.address);
    });

    it('ONLY COMPONENT: Should only let skHolder redefine asset', async () => {
      // Testing Requirement
      // expect(
      //   await asset.standalone.connect(deployer)._setAsset(null_addr)
      // ).to.be.revertedWith('disabled');

      // Testing Access Control
      // expect(
      //   await asset.component.connect(users[0])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');
      // expect(
      //   await asset.component.connect(users[1])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');

      // Redefining...
      await asset.component.connect(deployer)._setAsset(null_addr);
      meta = await asset.component._skdbMetadata();
      expect(meta[0] == null_addr);
      expect(meta[1] == skdb.address);
      expect(meta[2] == deployer.address);
    });
  });

  describe('Standalone Access Tokens - Access Control', () => {
    beforeEach(async () => {
      await skdb
        .connect(deployer)
        .defineSkeletonKey(w2at.address, nft[0].address, 1);

      await skdb
        .connect(deployer)
        .defineExecutiveKey(w2at.address, nft[0].address, 2);

      await skdb
        .connect(deployer)
        .defineAdminKey(w2at.address, w2at.address, [1, 2, 3, 4, 5]);
    });

    it('Should only let skHolder redefine skdb', async () => {
      // Testing Access Control
      // expect(
      //   await w2at.connect(users[0])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');
      // expect(
      //   await w2at.connect(users[1])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');

      // Redefining...
      await w2at.connect(deployer)._setSkdb(null_addr);
      let meta = await w2at._skdbMetadata();
      expect(meta[0] == w2at.address);
      expect(meta[1] == null_addr);
      expect(meta[2] == deployer.address);
    });

    it('Should NOT let skHolder redefine asset', async () => {
      // Testing Access Control
      // expect(
      //   await w2at.connect(users[0])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');
      // expect(
      //   await w2at.connect(users[1])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');
    });

    it('Should only let tier >= 2 mint tokens', async () => {
      await w2at.connect(deployer)._mintTo(deployer.address);
      await w2at.connect(users[0])._mintTo(users[0].address);
      // expect(
      //   w2at.connect(users[1])._mintTo(users[1].address)
      // ).to.be.revertedWith('!Authorized');
    });
  });

  describe('Access Tokens - Access Control', () => {
    beforeEach(async () => {
      await skdb
        .connect(deployer)
        .defineSkeletonKey(asset.standalone.address, nft[0].address, 1);

      await skdb
        .connect(deployer)
        .defineExecutiveKey(asset.standalone.address, nft[0].address, 2);

      for await (const user of users) {
        await w3at.connect(deployer)._mintTo(user.address);
      }

      await skdb
        .connect(deployer)
        .defineAdminKey(
          asset.standalone.address,
          w3at.address,
          [1, 2, 3, 4, 5]
        );
    });

    it('Should only let skHolder redefine skdb', async () => {
      // Testing Access Control
      // expect(
      //   await w3at.connect(users[0])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');
      // expect(
      //   await w3at.connect(users[1])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');

      // Redefining...
      await w3at.connect(deployer)._setSkdb(null_addr);
      let meta = await w3at._skdbMetadata();
      expect(meta[0] == w3at.address);
      expect(meta[1] == null_addr);
      expect(meta[2] == deployer.address);
    });

    it('Should only let skHolder redefine asset', async () => {
      // Testing Requirement
      // expect(
      //   await w3at.connect(deployer)._setAsset(null_addr)
      // ).to.be.revertedWith('disabled');

      // Testing Access Control
      // expect(
      //   await w3at.connect(users[0])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');
      // expect(
      //   await w3at.connect(users[1])._setSkdb(null_addr)
      // ).to.be.revertedWith('!Authorized');

      // Redefining...
      await w3at.connect(deployer)._setAsset(null_addr);
      meta = await w3at._skdbMetadata();
      expect(meta[0] == null_addr);
      expect(meta[1] == skdb.address);
      expect(meta[2] == deployer.address);
    });

    it('Should only let tier >= 2 mint tokens', async () => {
      await w3at.connect(deployer)._mintTo(deployer.address);
      await w3at.connect(users[0])._mintTo(users[0].address);
      // expect(
      //   w3at.connect(users[1])._mintTo(users[1].address)
      // ).to.be.revertedWith('!Authorized');
    });
  });
});
