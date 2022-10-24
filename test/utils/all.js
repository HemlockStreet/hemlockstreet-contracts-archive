const { ethers } = require('hardhat');
const { expect } = require('chai');
const { translate, get } = require('../../utils/evm/all.js');
const { address, uint } = translate;

const getProvider = () => ethers.provider;

async function deploy(name, args = [], dep = null) {
  let deployer;
  if (dep === null) {
    console.log(`${name}: Missing Signer! Extrapolating...`);
    const primarySigner = await getDeployer();
    deployer = primarySigner;
  } else deployer = dep;

  contractFactory = await ethers.getContractFactory(name);
  contract = await contractFactory.connect(deployer).deploy(...args);

  return contract;
}

async function getSigners() {
  const [deployer, skHolder, ekHolder, ...signers] = await get.signers();
  const admins = signers.slice(0, 5);
  const users = signers.slice(5, signers.length);
  return {
    deployer,
    skHolder,
    ekHolder,
    admins,
    users,
  };
}

function nonZeroAddr(entity) {
  expect(address(entity)).to.not.equal(address(0));
}

module.exports = {
  address,
  uint,
  get,
  getProvider,
  deploy,
  getSigners,
  nonZeroAddr,
};
