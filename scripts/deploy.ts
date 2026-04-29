import hre, { network } from "hardhat";
import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";

const { ethers } = await network.getOrCreate();

async function verify(address: string, constructorArgs: unknown[]) {
  console.log(`Verifying ${address} ...`);
  try {
    await verifyContract(
      {
        address,
        constructorArgs,
        provider: "etherscan",
      },
      hre,
    );
    console.log(`Verified: ${address}`);
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    if (msg.toLowerCase().includes("already verified")) {
      console.log(`Already verified: ${address}`);
    } else {
      console.error(`Failed to verify ${address}:`, msg);
    }
  }
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const maxSupply = ethers.parseEther("1000000");
  const rate = 100n;

  const Token = await ethers.getContractFactory("EightySixToken");
  const token = await Token.deploy(maxSupply);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed at:", tokenAddress);

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(tokenAddress, rate);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("Treasury deployed at:", treasuryAddress);

  await (await token.setTreasury(treasuryAddress)).wait();
  console.log("Deployment complete");

  const networkName = process.env.HARDHAT_NETWORK ?? "";
  const skipVerify =
    networkName === "" ||
    networkName.startsWith("hardhat") ||
    networkName === "ganache";

  if (skipVerify) {
    console.log(`Skipping verification on network "${networkName || "in-process"}"`);
    return;
  }

  console.log("Waiting 30s for the explorer to index the deployment...");
  await new Promise((r) => setTimeout(r, 30_000));

  await verify(tokenAddress, [maxSupply]);
  await verify(treasuryAddress, [tokenAddress, rate]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
