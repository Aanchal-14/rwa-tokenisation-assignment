import { ethers } from "ethers";
import { queries } from "../db/repositories.js";

export function listDepositsByUser(address: string, limit = 50, offset = 0) {
  return queries.depositsByDepositer({
    depositer: ethers.getAddress(address),
    limit,
    offset,
  });
}

export function listWithdrawsByUser(address: string, limit = 50, offset = 0) {
  return queries.withdrawsByOwner({
    owner: ethers.getAddress(address),
    limit,
    offset,
  });
}
