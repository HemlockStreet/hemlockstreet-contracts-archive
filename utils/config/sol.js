const config = (
  version = '0.8.17',
  optimizer = { enabled: true, runs: 200 },
  otherSettings = {}
) => {
  return {
    version,
    settings: {
      optimizer,
      ...otherSettings,
    },
  };
};

module.exports = { config };
