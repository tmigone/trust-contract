import '@typechain/hardhat'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import "@nomiclabs/hardhat-etherscan";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: process.env.MNEMONIC ? {
        mnemonic: process.env.MNEMONIC,
      } : undefined,
    }
  },
  etherscan: {
    apiKey: {
      optimisticEthereum: `${process.env.ETHERSCAN_KEY}`,
    }
  }
};

export default config;
