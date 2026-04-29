import { network } from "hardhat";

const { ethers } = await network.create({
  network: "hardhatOp",
  chainType: "l1",
});

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const maxSupply = ethers.parseEther("1000000"); // 1M token hard cap
  const rate = 100n; // 1 ETH = 100 tokens

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

  const tx = await token.setTreasury(treasuryAddress);
  await tx.wait();

  console.log("Treasury linked. Deployment complete.");
  console.log(`  Max supply : ${ethers.formatEther(maxSupply)} EST`);
  console.log(`  Rate       : ${rate} tokens per ETH`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
