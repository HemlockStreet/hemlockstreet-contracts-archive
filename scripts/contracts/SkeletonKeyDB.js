const { deployment, artifacts } = require('../../utils/evm/all.js');

async function deploy(chainId) {
  const skdb = await deployment.andVerify('SkeletonKeyDB', chainId);
  return skdb;
}

function retrieve(chainId) {
  return artifacts.getContract('SkeletonKeyDB', chainId);
}

module.exports = { deploy, retrieve };
