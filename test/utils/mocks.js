const { deploy } = require('./all');

async function deployMocks(signers) {
  const { deployer, skHolder, ekHolder } = signers;

  let tkn = {};

  tkn.shitcoin = await deploy('MintyFresh', [], deployer);

  tkn.usdt = await deploy('TetherUsd', [], deployer);
  tkn.link = await deploy('ChainlinkToken', [], deployer);
  tkn.weth = await deploy('WrappedEthereum', [], deployer);
  tkn.matic = await deploy('Matic', [], deployer);
  tkn.wbtc = await deploy('WrappedBitcoin', [], deployer);

  tkn.nft = await deploy('ExpensiveJpeg', [], skHolder);
  await tkn.nft.connect(ekHolder).quickMint();

  return tkn;
}

module.exports = { deployMocks };
