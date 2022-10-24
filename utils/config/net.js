const mainnets = {
  mainnet: {
    name: 'Ethereum Mainnet',
    rpc: 'https://mainnet.infura.io/v3/',
    chainId: 1,
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
  },
  binance: {
    name: 'Binance Smart Chain Mainnet',
    rpc: 'https://bsc-dataseed1.binance.org',
    chainId: 56,
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
  },
  polygon: {
    name: 'Polygon Mainnet',
    rpc: 'https://polygon-rpc.com',
    chainId: 137,
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
  },
  gnosis: {
    name: 'Gnosis',
    rpc: 'https://rpc.gnosischain.com',
    chainId: 100,
    symbol: 'xDAI',
    explorer: 'https://gnosisscan.io',
    gas: 'USD', // this is a weird one
  },
  heco: {
    name: 'Huobi ECO Chain Mainnet',
    rpc: 'https://http-mainnet.hecochain.com',
    chainId: 128,
    symbol: 'HT',
    explorer: 'https://hecoinfo.com',
  },
  avalanche: {
    name: 'Avalanche C-Chain',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 43114,
    symbol: 'AVAX',
    explorer: 'https://snowtrace.io',
  },
  fantom: {
    name: 'Fantom Opera',
    rpc: 'https://rpc.ftm.tools',
    chainId: 250,
    symbol: 'FTM',
    explorer: 'https://ftmscan.com',
  },
  arbitrum: {
    name: 'Arbitrum One',
    rpc: 'https://arb1.arbitrum.io/rpc',
    chainId: 42161,
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
  },
  harmony: {
    name: 'Harmony Mainnet Shard 0',
    rpc: 'https://api.harmony.one',
    chainId: 1666600000,
    symbol: 'ONE',
    explorer: 'https://explorer.harmony.one',
  },
  optimism: {
    name: 'Optimism',
    rpc: 'https://mainnet.optimism.io',
    chainId: 10,
    symbol: 'ETH',
    explorer: 'https://optimistic.etherscan.io',
  },
  moonriver: {
    name: 'Moonriver',
    rpc: 'https://rpc.api.moonriver.moonbeam.network',
    chainId: 1285,
    symbol: 'MOVR',
    explorer: 'https://moonriver.moonscan.io',
  },
  moonbeam: {
    name: 'Moonbeam',
    rpc: 'https://rpc.api.moonbeam.network',
    chainId: 1284,
    symbol: 'GLMR',
    explorer: 'https://moonbeam.moonscan.io',
  },
  metis: {
    name: 'Metis Andromeda Mainnet',
    rpc: 'https://andromeda.metis.io/?owner=1088',
    chainId: 1088,
    symbol: 'METIS',
    explorer: 'https://andromeda-explorer.metis.io',
  },
  klaytn: {
    name: 'Klaytn Mainnet Cypress',
    rpc: 'https://public-node-api.klaytnapi.com/v1/cypress',
    chainId: 8217,
    symbol: 'KLAY',
    explorer: 'https://scope.klaytn.com',
  },
};

const local = (chainId = 31337) => {
  return {
    name: 'localhost',
    rpc: `http://127.0.0.1:${chainId}/`,
    chainId,
    symbol: 'ETH',
    explorer: undefined,
  };
};

const testnets = {
  goerli: {
    name: 'Goerli test network',
    rpc: 'https://goerli.infura.io/v3/',
    chainId: 5,
    symbol: 'ETH',
    explorer: 'https://goerli.etherscan.io',
  },
  binanceTestnet: {
    name: 'Binance Smart Chain Testnet',
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainId: 97,
    symbol: 'BNB',
    explorer: 'https://testnet.bscscan.com',
  },
  mumbai: {
    name: 'Mumbai',
    rpc: 'https://matic-mumbai.chainstacklabs.com',
    chainId: 80001,
    symbol: 'MATIC',
    explorer: 'https://mumbai.polygonscan.com',
  },
  fuji: {
    name: 'Avalanche Fuji Testnet',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    chainId: 43113,
    symbol: 'AVAX',
    explorer: 'https://testnet.snowtrace.io',
  },
  fantomTestnet: {
    name: 'Fantom Testnet',
    rpc: 'https://rpc.testnet.fantom.network',
    chainId: 4002,
    symbol: 'FTM',
    explorer: 'https://testnet.ftmscan.com',
  },
  arbitrumGoerli: {
    name: 'Arbitrum Görli',
    rpc: 'https://goerli-rollup.arbitrum.io/rpc',
    chainId: 421613,
    symbol: 'ETH',
    explorer: 'https://goerli-rollup-explorer.arbitrum.io',
  },
  optimismGoerli: {
    name: 'Optimism Goerli Testnet',
    rpc: 'https://goerli.optimism.io',
    chainId: 420,
    symbol: 'ETH',
    explorer: 'https://optimism.io',
  },
  baobab: {
    name: 'Klaytn Testnet Baobab',
    rpc: 'https://api.baobab.klaytn.net:8651',
    chainId: 1001,
    symbol: 'KLAY',
    explorer: 'https://www.klaytn.com/',
  },
};

const localIds = [31337, 1337];

const type = (chainId) => {
  if (localIds.includes(chainId)) return 'local';

  const mainIds = [];
  const mainKeys = Object.keys(mainnets);
  mainKeys.forEach((key) => mainIds.push(mainnets[key].chainId));
  if (mainIds.includes(chainId)) return 'mainnet';

  const testIds = [];
  const testKeys = Object.keys(testnets);
  testKeys.forEach((key) => testIds.push(testnets[key].chainId));
  if (testIds.includes(chainId)) return 'testnet';

  throw new Error('config/net - type: Unplanned ChainId');
};

const details = (chainId) => {
  let info;

  const mainKeys = Object.keys(mainnets);
  mainKeys.forEach((key) => {
    if (mainnets[key].chainId === chainId) info = mainnets[key];
  });

  const testKeys = Object.keys(testnets);
  testKeys.forEach((key) => {
    if (testnets[key].chainId === chainId) info = testnets[key];
  });

  if (!info) throw new Error('config/net - get: Unplanned ChainId');

  return info;
};

function get(name) {
  let info;
  const mLabels = Object.keys(mainnets);
  if (mLabels.includes(name)) info = mainnets[name];

  const tLabels = Object.keys(testnets);
  if (tLabels.includes(name)) info = testnets[name];

  if (!info) throw new Error('config/net - get: Unplanned ChainId');

  return info;
}

module.exports = {
  utils: { type, details, get },
  data: { testnets, mainnets, local },
};
