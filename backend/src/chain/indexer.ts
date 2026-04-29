import { ethers } from "ethers";
import { events, indexerState } from "../db/repositories.js";
import { getBlockTimestamp, treasuryContract } from "./contracts.js";

type EventKind = "Deposit" | "Withdraw";

const blockTimestampCache = new Map<number, number>();
async function timestampOf(blockNumber: number): Promise<number> {
  const cached = blockTimestampCache.get(blockNumber);
  if (cached !== undefined) return cached;
  const ts = await getBlockTimestamp(blockNumber);
  blockTimestampCache.set(blockNumber, ts);
  return ts;
}

async function persistEvent(kind: EventKind, log: ethers.EventLog | ethers.Log) {
  const evt = log as ethers.EventLog;
  const ts = await timestampOf(evt.blockNumber);
  const base = {
    tx_hash: evt.transactionHash,
    log_index: evt.index,
    block_number: evt.blockNumber,
    block_timestamp: ts,
  };

  switch (kind) {
    case "Deposit": {
      const [depositer, ethAmount, tokensMinted] = evt.args ?? [];
      events.insertDeposit({
        ...base,
        depositer: ethers.getAddress(depositer),
        eth_amount: ethAmount.toString(),
        tokens_minted: tokensMinted.toString(),
      });
      return;
    }
    case "Withdraw": {
      const [owner, amount] = evt.args ?? [];
      events.insertWithdraw({
        ...base,
        owner_address: ethers.getAddress(owner),
        amount: amount.toString(),
      });
      return;
    }
  }
}

function handle(kind: EventKind, log: ethers.EventLog | ethers.Log) {
  persistEvent(kind, log)
    .then(() => indexerState.setLastBlock((log as ethers.EventLog).blockNumber))
    .catch((err) => console.error(`[indexer] persist ${kind} failed:`, err));
}

export function startIndexer(): void {
  treasuryContract.on(treasuryContract.filters.Deposit(), (...args) => {
    handle("Deposit", args[args.length - 1] as ethers.EventLog);
  });
  treasuryContract.on(treasuryContract.filters.Withdraw(), (...args) => {
    handle("Withdraw", args[args.length - 1] as ethers.EventLog);
  });
  console.log("[indexer] live listeners attached for Deposit/Withdraw");
}

export function stopIndexer() {
  treasuryContract.removeAllListeners();
}
