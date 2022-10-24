const fs = require('fs');
const { ethers } = require('hardhat');

const pathTo = (name) => `./utils/interfaces/${name}.json`;

const getAbi = (name) => JSON.parse(fs.readFileSync(pathTo(name))).abi;

const getContract = (name, address) => {
  return new ethers.Contract(address, getAbi(name), ethers.provider);
};

module.exports = { getContract };
