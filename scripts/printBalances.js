const { net } = require('../utils/config/all.js');
const { translate, get } = require('../utils/evm/all.js');
const address = translate.address;

async function getBalances() {
  const signers = await get.signers();
  const chainId = await get.chainId();

  console.log(`\nAvailable Signers on ${chainId}: ${signers.length}\n`);

  for await (const signer of signers) {
    const balance = (await get.balance(signer)) / 10 ** 18;
    const symbol = net.utils.details(chainId).symbol;
    console.log(`${address(signer)} || ${symbol} Balance: ${balance}`);
  }

  console.log();
}

getBalances();
