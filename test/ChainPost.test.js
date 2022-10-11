const { ethers } = require('hardhat');
const { assert, expect } = require('chai');

const null_addr = '0x0000000000000000000000000000000000000000';

describe('someTest', () => {
  let deployer, skHolder, ekHolder, signers, admins, users;
  let nft, skdb, accessToken, converter, chainPost, indexer;
  let feed = {};
  let usdt, weth, link, matic, wbtc;

  async function deploy(name, args = [], from = deployer) {
    contractFactory = await ethers.getContractFactory(name);
    contract = await contractFactory.connect(from).deploy(...args);
    return contract;
  }

  async function initSigners() {
    [deployer, skHolder, ekHolder, ...signers] = await ethers.getSigners();
    admins = signers.slice(0, 5);
    users = signers.slice(5, signers.length);
  }

  async function deployStandaloneContracts() {
    skdb = await deploy('SkeletonKeyDB');

    converter = await deploy('PriceConverter');

    nft = await deploy('ExpensiveJpeg', [], skHolder);

    feed.tetherUsd = await deploy('MockFeedTether');

    feed.ethUsd = await deploy('MockFeedEthereum');

    feed.linkUsd = await deploy('MockFeedChainlink');

    feed.maticUsd = await deploy('MockFeedPolygon');

    feed.btcUsd = await deploy('MockFeedBitcoin');

    feed.wbtcBtc = await deploy('MockFeedWrappedBitcoin');

    usdt = await deploy('TetherUsd');

    link = await deploy('ChainlinkToken');

    weth = await deploy('WrappedEthereum');

    matic = await deploy('Matic');

    wbtc = await deploy('WrappedBitcoin');
  }

  beforeEach(async () => {
    await initSigners();
    await deployStandaloneContracts();

    chainPost = await deploy('ChainPost', [skdb.address, converter.address]);

    await nft.connect(ekHolder).quickMint();

    await skdb
      .connect(deployer)
      .defineSkeletonKey(chainPost.address, nft.address, 1);
    await skdb
      .connect(skHolder)
      .defineExecutiveKey(chainPost.address, nft.address, 2);

    accessToken = await deploy('ChainPostAccessToken', [
      skdb.address,
      chainPost.address,
      '',
    ]);

    for await (const admin of admins) {
      await accessToken.connect(ekHolder).mintTo(admin.address);
    }

    await skdb
      .connect(ekHolder)
      .defineAdminKey(chainPost.address, accessToken.address, [1, 2, 3, 4, 5]);

    indexer = await deploy('ChainPostIndexer', [
      skdb.address,
      chainPost.address,
    ]);

    await chainPost.connect(skHolder).setIndexer;
  });

  describe('ChainPost Ecosystem Initialization', () => {
    async function validateInitialStateOf(target) {
      const temp = await target._skdbMetadata();
      const meta = {
        asset: temp[0],
        skdb: temp[1],
        deployer: temp[2],
      };
      expect(meta.asset == chainPost.address);
      expect(meta.skdb == skdb.address);
      expect(meta.deployer == deployer.address);
    }

    it('ChainPost', async () => {
      await validateInitialStateOf(chainPost);
    });
    it('Indexer', async () => {
      await validateInitialStateOf(indexer);
    });
    it('AccessToken', async () => {
      await validateInitialStateOf(accessToken);
    });
  });

  describe('ChainPost - Access Control', () => {
    it('Allows Tier >= 2 to set the Indexer', async () => {
      await chainPost.connect(skHolder).setIndexer(null_addr);
      expect((await chainPost._indexer) == null_addr);

      await chainPost.connect(ekHolder).setIndexer(converter.address);
      expect((await chainPost._indexer) == converter.address);

      // !Authorized
      //   expect(
      //     await chainPost.connect(ekHolder).setIndexer(null_addr)
      //   ).to.be.revertedWith('!Authorized');
    });

    it('Allows Tier >= 2 to set the Converter', async () => {
      await chainPost.connect(skHolder).setConverter(null_addr);
      expect((await chainPost._converter) == null_addr);

      await chainPost.connect(ekHolder).setConverter(indexer.address);
      expect((await chainPost._converter) == indexer.address);

      // !Authorized
      //   expect(
      //     await chainPost.connect(ekHolder).setConverter(null_addr)
      //   ).to.be.revertedWith('!Authorized');
    });
  });

  async function registerTokens() {
    await indexer.connect(skHolder).registerToken('ETH', null_addr);
    await indexer.connect(skHolder).registerToken('USDT', usdt.address);
    await indexer.connect(ekHolder).registerToken('wETH', weth.address);
    await indexer.connect(admins[0]).registerToken('LINK', link.address);
    await indexer.connect(admins[1]).registerToken('MATIC', matic.address);
    await indexer.connect(admins[2]).registerToken('wBTC', wbtc.address);
  }

  async function registerFeeds() {
    await indexer
      .connect(skHolder)
      .registerFeed(1, 'USD', feed.tetherUsd.address);
    await indexer.connect(ekHolder).registerFeed(2, 'USD', feed.ethUsd.address);
    await indexer
      .connect(admins[0])
      .registerFeed(3, 'USD', feed.linkUsd.address);
    await indexer
      .connect(admins[1])
      .registerFeed(4, 'USD', feed.maticUsd.address);
    await indexer
      .connect(admins[2])
      .registerFeed(5, 'USD', feed.btcUsd.address);
    await indexer
      .connect(admins[3])
      .registerFeed(5, 'BTC', feed.wbtcBtc.address);
  }

  describe('ChainPostIndexer Access Control', () => {
    it('Allows Tier > 0 to register tokens', async () => {
      await registerTokens();
    });

    it('Allows Tier > 0 to register price feeds', async () => {
      await registerFeeds();
    });
  });

  describe('ChainPostIndexer - View Functions', () => {
    beforeEach(async () => {
      await registerTokens();
      await registerFeeds();
    });
    it('Passes', async () => {
      console.log(await indexer.token(1));
      console.log(await indexer.priceFeed(1));
      console.log(await indexer.numSupported());
      console.log(await indexer.metadata(1));
    });
  });
});
