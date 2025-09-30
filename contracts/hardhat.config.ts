import "@vechain/sdk-hardhat-plugin";

import * as dotenv from "dotenv";
dotenv.config();

import "@nomicfoundation/hardhat-toolbox-viem";
import { HDKey } from "@vechain/sdk-core";
import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "paris",
        },
      },
    ],
  },
  networks: {
    vechainTestnet: {
      url: "https://testnet.vechain.org",
      accounts: {
        mnemonic: process.env.VECHAIN_TESTNET_MNEMONIC as string,
        path: HDKey.VET_DERIVATION_PATH,
        count: 3,
        initialIndex: 0,
        passphrase: "vechainthor",
      },
      debug: true, // It works despite the type error
      delegator: undefined, // It works despite the type error
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1,
      timeout: 20000,
      httpHeaders: {},
    },
  },
};

export default config;
