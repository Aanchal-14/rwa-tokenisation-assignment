import { ethers } from "ethers";
import { events } from "../db/repositories.js";
import { provider, treasuryContract } from "./contracts.js";

export function startIndexer() {
  treasuryContract.on(treasuryContract.filters.Deposit(), async (...args) => {
    try {
      const payload = args[args.length - 1] as ethers.ContractEventPayload;
      const log = payload.log;
      const depositer = ethers.getAddress(log.args[0]);
      const ethAmount = log.args[1].toString();
      const tokensMinted = log.args[2].toString();
      console.log(`[indexer] Deposit  block=${log.blockNumber} tx=${log.transactionHash} from=${depositer} eth=${ethAmount} tokens=${tokensMinted}`);

      const block = await provider.getBlock(log.blockNumber);
      events.insertDeposit({
        tx_hash: log.transactionHash,
        log_index: log.index,
        block_number: log.blockNumber,
        block_timestamp: block?.timestamp ?? 0,
        depositer,
        eth_amount: ethAmount,
        tokens_minted: tokensMinted,
      });
      console.log(`[indexer] Deposit stored`);
    } catch (err) {
      console.error("[indexer] Deposit handler failed:", (err as Error).message ?? err);
    }
  });

  treasuryContract.on(treasuryContract.filters.Withdraw(), async (...args) => {
    try {
      const payload = args[args.length - 1] as ethers.ContractEventPayload;
      const log = payload.log;
      const owner = ethers.getAddress(log.args[0]);
      const amount = log.args[1].toString();
      console.log(`[indexer] Withdraw block=${log.blockNumber} tx=${log.transactionHash} owner=${owner} amount=${amount}`);

      const block = await provider.getBlock(log.blockNumber);
      events.insertWithdraw({
        tx_hash: log.transactionHash,
        log_index: log.index,
        block_number: log.blockNumber,
        block_timestamp: block?.timestamp ?? 0,
        owner_address: owner,
        amount,
      });
      console.log(`[indexer] Withdraw stored`);
    } catch (err) {
      console.error("[indexer] Withdraw handler failed:", (err as Error).message ?? err);
    }
  });

  console.log("[indexer] listening for Deposit/Withdraw");
}

export function stopIndexer() {
  treasuryContract.removeAllListeners();
}
