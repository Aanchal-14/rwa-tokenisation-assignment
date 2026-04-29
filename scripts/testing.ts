import { network } from "hardhat";

const { ethers } = await network.create({
  network: "hardhatOp",
  chainType: "l1",
});

async function main() {
  const [owner, user] = await ethers.getSigners();

  console.log("Owner:", owner.address);
  console.log("User:", user.address);

  const ownerBalance = await ethers.provider.getBalance(owner.address);
  console.log("Owner balance:", ethers.formatEther(ownerBalance));

  const userBalance = await ethers.provider.getBalance(user.address);
  console.log("User balance:", ethers.formatEther(userBalance));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
