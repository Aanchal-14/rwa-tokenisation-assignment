import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import { configVariable, defineConfig } from "hardhat/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin, hardhatVerify],
  verify: {
    etherscan: {
      apiKey: process.env.POLYGONSCAN_API_KEY ?? "",
    },
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
      forking: {
        url: configVariable("RPC_URL"),
      },
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },

    amoy: {
      type: "http",
      chainType: "l1",
      chainId: 80002,
      url: configVariable("RPC_URL"),
      accounts: [configVariable("PRIVATE_KEY")],


    },

    ganache: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
      gas: 6_000_000,
    },
  },
});
