const { ethers } = require('hardhat');
const { address, uint } = require('./translate.js');

const balance = async (entity) => {
  if (entity === undefined) throw new Error('getBalance: Undefined Entity');
  let raw = await ethers.provider.getBalance(address(entity));
  return uint(raw);
};
const signers = async () => await ethers.getSigners();
const deployer = async () => (await signers())[0];
const network = async () => await ethers.provider.getNetwork();
const chainId = async () => (await network()).chainId;

module.exports = { balance, signers, deployer, network, chainId };
