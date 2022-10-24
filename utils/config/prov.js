const chainstack = (sub, key) => {
  return key ? `https://${sub}.p2pify.com/${key}/` : undefined;
};

const alchemy = (sub, key) => {
  return key ? `https://${sub}.g.alchemy.com/v2/${key}/` : undefined;
};

module.exports = { chainstack, alchemy };
