import { ethers } from "hardhat";
import { Signer } from "ethers";

import WalletConnectProvider from "@walletconnect/web3-provider";

async function deploy(deployer: Signer) {

  const address = await deployer.getAddress();
  console.log("Deploying contracts with the account:", address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const ONE_DAY_IN_SECS = 1 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_DAY_IN_SECS;

  const lockedAmountInput = "0.01";
  const lockedAmount = ethers.utils.parseEther(lockedAmountInput);

  console.log(`About to deploy Trust which unlocks at ${unlockTime}...`);
  const Trust = await ethers.getContractFactory("Trust");
  const trust = await Trust.connect(deployer).deploy(address, unlockTime);
  
  await trust.deployed();
  console.log(`Trust which unlocks at ${unlockTime} deployed to: ${trust.address}`);

  // send ETH to trust
  const tx = await trust.connect(deployer).deposit({value: lockedAmount})
  console.log(tx.hash);
  await tx.wait();

  console.log(`Trust with ${lockedAmountInput} ETH deployed to: ${trust.address}`);
}

async function main() {

  //  Create WalletConnect Provider
  const provider = new WalletConnectProvider({
    infuraId: process.env.INFURA_ID || "27e484dcd9e3efcfd25a83a78777cdf1", // use public infura id if not set
    rpc: {10: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_ID}`},
    clientMeta: {
      description: "WalletConnect NodeJS Client",
      url: "https://nodejs.org/en/",
      icons: ["https://nodejs.org/static/images/logo.svg"],
      name: "Trust Contraft Deployer",
    },
  });

  //  Enable session (triggers QR Code modal)
  await provider.enable();

  const web3Provider = new ethers.providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();
  await deploy(signer);
  console.log('done!');

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});