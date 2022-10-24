require('dotenv').config();
const net = require('./net.js');

const main = process.env.MAINNET_ACCOUNTS;

const mainnet = main.includes(',') ? main.split(',') : [main];
const testnet = process.env.TESTNET_ACCOUNTS.split(',');

const get = (name) => {
  try {
    const info = net.utils.get(name);
    const chainId = info.chainId;
    const type = net.utils.type(chainId);
    if (type === 'testnet') return testnet;
    if (type === 'mainnet') return mainnet;
  } catch (error) {
    console.log(error);
    throw new Error('config/acc - get: Unplanned ChainId');
  }
};

module.exports = { data: { mainnet, testnet }, utils: { get } };
