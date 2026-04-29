import { db } from "./client.js";

export type DepositRow = {
  tx_hash: string;
  log_index: number;
  block_number: number;
  block_timestamp: number;
  depositer: string;
  eth_amount: string;
  tokens_minted: string;
};

export type WithdrawRow = {
  tx_hash: string;
  log_index: number;
  block_number: number;
  block_timestamp: number;
  owner_address: string;
  amount: string;
};

const insertDepositStmt = db.prepare(`
  INSERT OR IGNORE INTO deposits
    (tx_hash, log_index, block_number, block_timestamp, depositer, eth_amount, tokens_minted)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertWithdrawStmt = db.prepare(`
  INSERT OR IGNORE INTO withdraws
    (tx_hash, log_index, block_number, block_timestamp, owner_address, amount)
  VALUES (?, ?, ?, ?, ?, ?)
`);

export const events = {
  insertDeposit(r: DepositRow) {
    insertDepositStmt.run(
      r.tx_hash,
      r.log_index,
      r.block_number,
      r.block_timestamp,
      r.depositer,
      r.eth_amount,
      r.tokens_minted,
    );
  },
  insertWithdraw(r: WithdrawRow) {
    insertWithdrawStmt.run(
      r.tx_hash,
      r.log_index,
      r.block_number,
      r.block_timestamp,
      r.owner_address,
      r.amount,
    );
  },
};

const listDepositsByDepositer = db.prepare(`
  SELECT * FROM deposits WHERE depositer = ?
  ORDER BY block_number DESC, log_index DESC LIMIT ? OFFSET ?
`);
const listAllDeposits = db.prepare(`
  SELECT * FROM deposits ORDER BY block_number DESC, log_index DESC LIMIT ? OFFSET ?
`);
const listAllWithdraws = db.prepare(`
  SELECT * FROM withdraws ORDER BY block_number DESC, log_index DESC LIMIT ? OFFSET ?
`);

export const queries = {
  deposits(opts: { depositer?: string; limit: number; offset: number }) {
    return opts.depositer
      ? (listDepositsByDepositer.all(opts.depositer, opts.limit, opts.offset) as DepositRow[])
      : (listAllDeposits.all(opts.limit, opts.offset) as DepositRow[]);
  },
  withdraws(opts: { limit: number; offset: number }) {
    return listAllWithdraws.all(opts.limit, opts.offset) as WithdrawRow[];
  },
};

const getStateStmt = db.prepare(`SELECT value FROM indexer_state WHERE key = ?`);
const setStateStmt = db.prepare(`
  INSERT INTO indexer_state (key, value) VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`);

export const indexerState = {
  getLastBlock(): number | undefined {
    const row = getStateStmt.get("last_indexed_block") as { value: string } | undefined;
    return row ? Number(row.value) : undefined;
  },
  setLastBlock(blockNumber: number) {
    setStateStmt.run("last_indexed_block", String(blockNumber));
  },
};
