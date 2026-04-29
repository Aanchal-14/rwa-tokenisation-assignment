import { tokenContract } from "../chain/contracts.js";

export async function getBalance(address: string): Promise<string> {
  const bal = await tokenContract.balanceOf(address);
  return bal.toString();
}
