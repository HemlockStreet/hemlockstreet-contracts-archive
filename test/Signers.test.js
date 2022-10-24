const { expect } = require('chai');
const evm = require('./utils/all.js');
const nonZeroAddr = evm.nonZeroAddr;

describe('Signers', () => {
  let deployer, skHolder, ekHolder, admins, users;

  beforeEach(async () => {
    const signers = await evm.getSigners();
    deployer = signers.deployer;
    skHolder = signers.skHolder;
    ekHolder = signers.ekHolder;
    admins = signers.admins;
    users = signers.users;
  });

  describe('Setup', () => {
    it('Primary Signers', async () => {
      nonZeroAddr(deployer);
      nonZeroAddr(skHolder);
      nonZeroAddr(ekHolder);
    });

    it('Admins', async () => {
      expect(admins.length).to.equal(5);
      admins.forEach((admin) => {
        nonZeroAddr(admin);
      });
    });

    it('Excess Signers', async () => {
      users.forEach((user) => {
        nonZeroAddr(user);
      });
    });
  });
});
