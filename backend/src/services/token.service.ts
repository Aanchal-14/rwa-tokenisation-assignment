import { ethers } from "ethers";
import { tokenContract } from "../chain/contracts.js";

export async function getTokenInfo() {
  const [name, symbol, decimals, totalSupply, maxSupply, treasury, owner] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals(),
    tokenContract.totalSupply(),
    tokenContract.maxSupply(),
    tokenContract.treasury(),
    tokenContract.owner(),
  ]);
  return {
    name,
    symbol,
    decimals: Number(decimals),
    totalSupply: totalSupply.toString(),
    maxSupply: maxSupply.toString(),
    treasury,
    owner,
  };
}

export async function getBalance(address: string): Promise<string> {
  const bal = await tokenContract.balanceOf(address);
  return bal.toString();
}

async function send(method: string, args: unknown[]) {
  const tx = await tokenContract[method](...args);
  const receipt = await tx.wait();
  return { txHash: tx.hash, blockNumber: receipt?.blockNumber ?? null };
}

export function setTreasury(treasury: string) {
  if (!ethers.isAddress(treasury)) throw new Error("invalid treasury address");
  return send("setTreasury", [treasury]);
}
