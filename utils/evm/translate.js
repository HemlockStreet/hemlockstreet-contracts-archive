const address = (entity = 0) => {
  return entity === 0
    ? '0x0000000000000000000000000000000000000000'
    : entity.address;
};

const uint = (bigNumber) => {
  return parseInt(bigNumber.toString());
};

const mixed = (value) => {
  return value.map((element) => {
    if (element.isBigNumber()) uint(element);
  });
};

module.exports = { address, uint, mixed };
