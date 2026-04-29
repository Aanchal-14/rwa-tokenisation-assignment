import { ethers } from "ethers";
import { queries } from "../db/repositories.js";

function clampPaging(limit: unknown, offset: unknown) {
  const l = Math.min(Math.max(Number(limit ?? 50), 1), 500);
  const o = Math.max(Number(offset ?? 0), 0);
  return { limit: l, offset: o };
}

function normaliseAddress(maybe: string | undefined): string | undefined {
  if (!maybe) return undefined;
  if (!ethers.isAddress(maybe)) throw new Error(`invalid address: ${maybe}`);
  return ethers.getAddress(maybe);
}

export function listDeposits(params: { depositer?: string; limit?: unknown; offset?: unknown }) {
  const paging = clampPaging(params.limit, params.offset);
  return queries.deposits({ depositer: normaliseAddress(params.depositer), ...paging });
}

export function listWithdraws(params: { limit?: unknown; offset?: unknown }) {
  return queries.withdraws(clampPaging(params.limit, params.offset));
}
