const fs = require('fs');
const { ethers, artifacts } = require('hardhat');

async function runDeployment(contractName, chainId, args = []) {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const NewFactory = await ethers.getContractFactory(contractName);
  const NewContract = await NewFactory.deploy(...args);
  console.log(`\n${contractName} deployed to ${NewContract.address}`);
  console.log(
    `Account balance: ${(await deployer.getBalance()).toString() / 10 ** 18}`
  );
  saveDeploymentArtifacts(NewContract, contractName, chainId);
  return NewContract;
}

function saveDeploymentArtifacts(contract, name, chainId) {
  function writeFiles(pathToRoot, label) {
    if (fs.existsSync(pathToRoot)) {
      const pathToData = `${pathToRoot}/data/${chainId}`;
      const missingFolder = !fs.existsSync(pathToData);
      if (missingFolder) fs.mkdirSync(pathToData, { recursive: true });

      const pathToAddress = `${pathToData}/${name}-address.json`;
      const addressCache = JSON.stringify(
        { address: contract.address },
        undefined,
        2
      );
      fs.writeFileSync(pathToAddress, addressCache);

      const pathToArtifact = `${pathToData}/${name}.json`;
      const artifactCache = JSON.stringify(
        artifacts.readArtifactSync(name),
        null,
        2
      );
      fs.writeFileSync(pathToArtifact, artifactCache);

      console.log(`${label}: ${name} artifacts saved || chain:${chainId}`);
    }
  }
  writeFiles('./', 'root');
}

module.exports = { runDeployment, saveDeploymentArtifacts };
