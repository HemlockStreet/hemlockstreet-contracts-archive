const { deployment, artifacts } = require('../../utils/evm/all.js');

async function deploy(chainId) {
  console.log(`\nMass Deployment - MockNfts`, ['SkeletonKey', 'ExecutiveKey']);
  const sKey = await deployment.andVerify(
    'SkeletonKey',
    chainId,
    [],
    `contracts/Mocks/Mock721.sol:SkeletonKey`
  );

  const eKey = await deployment.andVerify(
    'ExecutiveKey',
    chainId,
    [],
    `contracts/Mocks/Mock721.sol:ExecutiveKey`
  );

  console.log('\nNFTs Deployed!');

  return { sKey, eKey };
}

function retrieve(chainId) {
  const sKey = artifacts.getContract(`SkeletonKey`, chainId);
  const eKey = artifacts.getContract(`ExecutiveKey`, chainId);
  return { sKey, eKey };
}

module.exports = { deploy, retrieve };
