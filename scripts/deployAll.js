const {
  runDeployment,
  saveDeploymentArtifacts,
} = require('./utils/deployment');
const hre = require('hardhat');
const ethers = hre.ethers;

(async () => {
  let contracts = [];
  // const localTestnets = [31337, 1337];
  const provider = new ethers.providers.JsonRpcProvider(hre.network.config.url);
  const { chainId } = await provider.getNetwork();
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  console.log(
    `\nDeploying contracts with ${deployer.address} on chain:${chainId}`
  );
  console.log(`Account balance: ${(await deployer.getBalance()).toString()}`);
  // const isLocal = localTestnets.includes(chainId);

  const skdb = await runDeployment('SkeletonKeyDB', chainId);
  contracts.push(skdb);

  const nft = await runDeployment('ExpensiveJpeg', chainId);
  await nft.connect(deployer).quickMint();
  contracts.push(nft);

  const priceConverter = await runDeployment('PriceConverter', chainId);
  contracts.push(priceConverter);

  const chainPost = await runDeployment('ChainPost', chainId, [
    skdb.address,
    priceConverter.address,
  ]);
  contracts.push(chainPost);

  await skdb
    .connect(deployer)
    .defineSkeletonKey(chainPost.address, nft.address, 1);
  await skdb
    .connect(deployer)
    .defineExecutiveKey(chainPost.address, nft.address, 2);

  const cpat = await runDeployment('ChainPostAccessToken', chainId, [
    skdb.address,
    chainPost.address,
    '',
  ]);
  contracts.push(cpat);

  const cpi = await runDeployment('ChainPostIndexer', chainId, [
    skdb.address,
    chainPost.address,
  ]);
  contracts.push(cpi);

  await chainPost.connect(deployer).setIndexer(cpi.address);

  console.log();
})();
