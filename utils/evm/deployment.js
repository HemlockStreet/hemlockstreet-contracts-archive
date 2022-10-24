const fs = require('fs');
const hre = require('hardhat');
const { ethers, artifacts } = hre;

async function run(name, chainId, args = []) {
  console.log(`\nDeploying ${name}...`);
  const NewFactory = await ethers.getContractFactory(name);
  const NewContract = await NewFactory.deploy(...args);

  console.log(`|| ${name} deployed to ${NewContract.address}`);

  let data = `./data/${chainId}`;
  if (!fs.existsSync(data)) {
    console.log(`|| ${data} does not exist! Creating...`);
    fs.mkdirSync(data, { recursive: true });
    console.log(`Created!`);
  }

  let path;
  path = `${data}/${name}-address.json`;
  const addressCache = JSON.stringify(
    { address: NewContract.address },
    undefined,
    2
  );
  console.log(`|||| Saving address to ${path}...`);
  fs.writeFileSync(path, addressCache);

  path = `${data}/${name}.json`;
  const artifactCache = JSON.stringify(
    artifacts.readArtifactSync(name),
    null,
    2
  );
  console.log(`|||| Saving artifacts to ${path}...`);
  fs.writeFileSync(path, artifactCache);

  console.log('|||||| Address & Artifacts Ready!');
  return NewContract;
}

async function andVerify(name, chainId, args = [], fqn) {
  const NewContract = await run(name, chainId, args);
  // return NewContract;
  const tx = NewContract.deployTransaction;

  const gas = {
    price: parseInt(tx.gasPrice.toString()) / 10 ** 9,
    limit: parseInt(tx.gasLimit.toString()),
  };
  console.log(
    `Tracking confirmation of tx:${tx.hash}\n` +
      `|| Nonce: ${tx.nonce} - Gas Price: ${gas.price} Gwei - Gas Limit: ${gas.limit} Wei`
  );

  console.log(`|||| Awaiting Confirmation...`);
  await tx.wait(5);
  console.log(`|||| Buffering...`);
  await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

  const options = {
    address: NewContract.address,
    constructorArguments: args,
  };
  if (fqn) options.contract = fqn;

  if (![1337, 31337].includes(chainId)) {
    try {
      console.log('Verifying...');
      await hre.run('verify:verify', options);
      console.log('|||| Verified!');
    } catch (e) {
      if (e.toString().split('\n')[2] !== 'Reason: Already Verified') throw e;
      else console.log('|||| Double Verified!');
    }
  }

  return NewContract;
}

module.exports = { run, andVerify };
