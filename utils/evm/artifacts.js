const fs = require('fs');
const { ethers } = require('hardhat');

const pathTo = (name, chainId) => {
  return {
    artifact: `./data/${chainId}/${name}.json`,
    address: `./data/${chainId}/${name}-address.json`,
  };
};

const present = (name, chainId) => {
  const paths = pathTo(name, chainId);
  const artifact = fs.existsSync(paths.artifact);
  const address = fs.existsSync(paths.address);
  return artifact && address;
};

function extract(name, chainId) {
  const paths = pathTo(name, chainId);

  const { abi } = JSON.parse(fs.readFileSync(paths.artifact));
  const { address } = JSON.parse(fs.readFileSync(paths.address));

  return { abi, address };
}

const getContract = (name, chainId) => {
  const stored = extract(name, chainId);
  // provider = ?
  const contract = new ethers.Contract(
    stored.address,
    stored.abi,
    ethers.provider
  );
  return contract;
};

module.exports = { pathTo, present, extract, getContract };
