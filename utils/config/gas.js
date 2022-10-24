require('dotenv').config();

const config = (
  enabled = true,
  excludeContracts = [],
  outputFile,
  currency = 'USD'
) => {
  let coinmarketcap = process.env.COINMARKETCAP;

  let settings = {
    enabled,
    currency,
    coinmarketcap,
    excludeContracts,
  };

  if (!coinmarketcap) settings.enabled = false;

  if (outputFile) {
    settings.outputFile = outputFile;
    settings.noColors = true;
  }

  return settings;
};

module.exports = { config };
