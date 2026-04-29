import { ethers } from "ethers";
import { provider, signer, treasuryContract } from "../chain/contracts.js";
import { config } from "../config.js";

export async function getTreasuryInfo() {
  const [rate, token, owner, balance] = await Promise.all([
    treasuryContract.rate(),
    treasuryContract.token(),
    treasuryContract.owner(),
    provider.getBalance(config.treasuryAddress),
  ]);
  return {
    rate: rate.toString(),
    token,
    owner,
    balanceWei: balance.toString(),
  };
}

export async function depositPreview(amountEth: string): Promise<string> {
  const rate: bigint = await treasuryContract.rate();
  const tokens = ethers.parseEther(amountEth) * rate;
  return tokens.toString();
}

async function send(method: string, args: unknown[], overrides: ethers.Overrides = {}) {
  const tx = await treasuryContract[method](...args, overrides);
  const receipt = await tx.wait();
  return { txHash: tx.hash, blockNumber: receipt?.blockNumber ?? null };
}

export function deposit(amountEth: string) {
  return send("deposit", [], { value: ethers.parseEther(amountEth) });
}

export function setRate(rate: string) {
  return send("setRate", [BigInt(rate)]);
}

export function withdraw(amount: string) {
  return send("withdraw", [BigInt(amount)]);
}

export function getSignerAddress() {
  return signer.address;
}
