import { ethers } from "ethers";
import { config } from "../config.js";

import eightySixTokenArtifact from "../../../artifacts/contracts/EightySixToken.sol/EightySixToken.json" with { type: "json" };
import treasuryArtifact from "../../../artifacts/contracts/Treasury.sol/Treasury.json" with { type: "json" };

export const provider = new ethers.JsonRpcProvider(config.rpcUrl);

export const treasuryInterface = new ethers.Interface(treasuryArtifact.abi);

export const tokenContract = new ethers.Contract(config.tokenAddress, eightySixTokenArtifact.abi, provider);
export const treasuryContract = new ethers.Contract(config.treasuryAddress, treasuryArtifact.abi, provider);

export async function getBlockTimestamp(blockNumber: number): Promise<number> {
  const block = await provider.getBlock(blockNumber);
  return block?.timestamp ?? 0;
}
