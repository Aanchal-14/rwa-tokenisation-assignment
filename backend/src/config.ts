import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config({ quiet: true });

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function address(name: string): string {
  const v = required(name);
  if (!ethers.isAddress(v)) {
    throw new Error(`Env var ${name} is not a valid address: "${v}"`);
  }
  return ethers.getAddress(v);
}

export const config = {
  rpcUrl: required("RPC_URL"),
  tokenAddress: address("TOKEN_ADDRESS"),
  treasuryAddress: address("TREASURY_ADDRESS"),
  port: Number(process.env.PORT ?? 3000),
  dbPath: process.env.DB_PATH ?? "data/indexer.db",
};
