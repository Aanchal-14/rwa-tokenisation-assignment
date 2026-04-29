import { ethers } from "ethers";
import { config } from "../config.js";

import eightySixTokenArtifact from "../../../artifacts/contracts/EightySixToken.sol/EightySixToken.json" with { type: "json" };
import treasuryArtifact from "../../../artifacts/contracts/Treasury.sol/Treasury.json" with { type: "json" };

export const provider = new ethers.JsonRpcProvider(config.rpcUrl);
export const signer = new ethers.Wallet(config.privateKey, provider);

export const tokenAbi = eightySixTokenArtifact.abi;
export const treasuryAbi = treasuryArtifact.abi;

export const tokenContract = new ethers.Contract(config.tokenAddress, tokenAbi, signer);
export const treasuryContract = new ethers.Contract(config.treasuryAddress, treasuryAbi, signer);

export async function getBlockTimestamp(blockNumber: number): Promise<number> {
  const block = await provider.getBlock(blockNumber);
  return block?.timestamp ?? 0;
}
