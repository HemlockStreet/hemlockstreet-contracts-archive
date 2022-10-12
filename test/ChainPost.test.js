const { ethers } = require('hardhat');
const { assert, expect } = require('chai');

const null_addr = '0x0000000000000000000000000000000000000000';

describe('ChainPost Ecosystem', () => {
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

    feed.wbtcUsd = await deploy('MockFeedWrappedBitcoinUsd'); // CHAINPOST EXCLUSIVE

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
      await accessToken.connect(ekHolder)._mintTo(admin.address);
    }

    await skdb
      .connect(ekHolder)
      .defineAdminKey(chainPost.address, accessToken.address, [1, 2, 3, 4, 5]);

    indexer = await deploy('ChainPostIndexer', [
      'ETH',
      weth.address,
      feed.ethUsd.address,
      skdb.address,
      chainPost.address,
    ]);

    await chainPost.connect(ekHolder)._setIndexer(indexer.address);
  });

  describe('ChainPost Ecosystem Initialization', () => {
    async function validateInitialStateOf(target) {
      const temp = await target._skdbMetadata();
      const meta = {
        asset: temp[0],
        skdb: temp[1],
        deployer: temp[2],
      };
      expect(meta.asset === chainPost.address);
      expect(meta.skdb === skdb.address);
      expect(meta.deployer === deployer.address);
    }

    it('ChainPost', async () => {
      await validateInitialStateOf(chainPost);
      expect((await chainPost._indexer) === indexer.address);
      expect((await chainPost._converter) === converter.address);
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
      await chainPost.connect(skHolder)._setIndexer(null_addr);
      expect((await chainPost._indexer) === null_addr);

      await chainPost.connect(ekHolder)._setIndexer(converter.address);
      expect((await chainPost._indexer) === converter.address);

      // !Authorized
      //   expect(
      //     await chainPost.connect(ekHolder).setIndexer(null_addr)
      //   ).to.be.revertedWith('!Authorized');
    });

    it('Allows Tier >= 2 to set the Converter', async () => {
      await chainPost.connect(skHolder)._setConverter(null_addr);
      expect((await chainPost._converter) === null_addr);

      await chainPost.connect(ekHolder)._setConverter(indexer.address);
      expect((await chainPost._converter) === indexer.address);

      // !Authorized
      //   expect(
      //     await chainPost.connect(ekHolder).setConverter(null_addr)
      //   ).to.be.revertedWith('!Authorized');
    });
  });

  async function registerTokens() {
    await indexer.connect(skHolder).registerToken('USDT', usdt.address);
    await indexer.connect(ekHolder).registerToken('LINK', link.address);
    await indexer.connect(admins[0]).registerToken('MATIC', matic.address);
    await indexer.connect(admins[1]).registerToken('WBTC', wbtc.address);
  }

  async function registerFeeds() {
    await indexer
      .connect(skHolder)
      .registerFeed(2, 'USD', feed.tetherUsd.address);
    await indexer
      .connect(admins[0])
      .registerFeed(3, 'USD', feed.linkUsd.address);
    await indexer
      .connect(admins[1])
      .registerFeed(4, 'USD', feed.maticUsd.address);
    await indexer
      .connect(admins[2])
      .registerFeed(5, 'USD', feed.wbtcUsd.address);
  }

  describe('ChainPostIndexer - Access Control', () => {
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

    async function validateMetadata(idx, tkn, pf) {
      let [currencyPair, feedAddr, tokenSymbol, tokenAddr] =
        await indexer.metadata(2);
      expect(currencyPair === 'USD');
      expect((await tkn.symbol()) === tokenSymbol);
      expect(feedAddr === pf.address);
      expect(tokenAddr === tkn.address);
    }

    it('Stores the metadata accordingly', async () => {
      const [registeredTokens, registeredFeeds] = await indexer.numSupported();
      expect(registeredTokens === 6 && registeredFeeds === 6);
      validateMetadata(1, weth, feed.ethUsd);
      validateMetadata(2, usdt, feed.tetherUsd);
      validateMetadata(3, link, feed.linkUsd);
      validateMetadata(4, matic, feed.maticUsd);
      validateMetadata(5, wbtc, feed.wbtcUsd);
    });

    it('allows the user to search for the token index by symbol', async () => {
      expect((await indexer.queryTokenSymbol('ETH')) === 1);
      expect((await indexer.queryTokenSymbol('USDT')) === 2);
      expect((await indexer.queryTokenSymbol('LINK')) === 3);
      expect((await indexer.queryTokenSymbol('MATIC')) === 4);
      expect((await indexer.queryTokenSymbol('WBTC')) === 5);
    });

    it('allows the user to search for the feed index by token symbol & base pair', async () => {
      expect((await indexer.queryFeedToken(1, 'USD')) === 1);
      expect((await indexer.queryFeedToken(2, 'USD')) === 2);
      expect((await indexer.queryFeedToken(3, 'USD')) === 3);
      expect((await indexer.queryFeedToken(4, 'USD')) === 4);
      expect((await indexer.queryFeedToken(5, 'USD')) === 5);
    });

    it('allows users to find a pair by symbol and base pair', async () => {
      expect((await indexer.queryPair('ETH', 'USD')) === 1);
      expect((await indexer.queryPair('USDT', 'USD')) === 2);
      expect((await indexer.queryPair('LINK', 'USD')) === 3);
      expect((await indexer.queryPair('MATIC', 'USD')) === 4);
      expect((await indexer.queryPair('WBTC', 'USD')) === 5);
    });
  });

  describe('ChainPost - View Functions', () => {
    beforeEach(async () => {
      await registerTokens();
      await registerFeeds();
    });

    it('acts as a passthrough for some methods', async () => {
      const idxrOut = await indexer.numSupported();
      const mainOut = await chainPost.numSupported();
      expect(mainOut[0] === idxrOut[0] && idxrOut[0] === 5);
      expect(mainOut[1] === idxrOut[1] && idxrOut[1] === 5);
    });

    it('should have an easy way for contracts to grab pricefeed & token addresses', async () => {
      const idxrOut = await indexer.metadata(1);
      const mainOut = await chainPost.findPair('ETH', 'USD');
      expect(mainOut[0] === idxrOut[0] && idxrOut[0] === weth.address);
      expect(mainOut[1] === idxrOut[0] && idxrOut[0] === feed.ethUsd.address);
    });
  });

  xdescribe('Some Test', () => {
    beforeEach(async () => {
      await registerTokens();
      await registerFeeds();
    });
    it('should pass', async () => {});
  });
});
