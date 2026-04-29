import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { config } from "../config.js";

const dbFile = path.resolve(config.dbPath);
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

export const db = new DatabaseSync(dbFile);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS indexer_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS deposits (
    tx_hash TEXT NOT NULL,
    log_index INTEGER NOT NULL,
    block_number INTEGER NOT NULL,
    block_timestamp INTEGER NOT NULL,
    depositer TEXT NOT NULL,
    eth_amount TEXT NOT NULL,
    tokens_minted TEXT NOT NULL,
    PRIMARY KEY (tx_hash, log_index)
  );
  CREATE INDEX IF NOT EXISTS idx_deposits_depositer ON deposits(depositer);
  CREATE INDEX IF NOT EXISTS idx_deposits_block ON deposits(block_number);

  CREATE TABLE IF NOT EXISTS withdraws (
    tx_hash TEXT NOT NULL,
    log_index INTEGER NOT NULL,
    block_number INTEGER NOT NULL,
    block_timestamp INTEGER NOT NULL,
    owner_address TEXT NOT NULL,
    amount TEXT NOT NULL,
    PRIMARY KEY (tx_hash, log_index)
  );
  CREATE INDEX IF NOT EXISTS idx_withdraws_block ON withdraws(block_number);
`);

export function closeDb() {
  try {
    db.close();
  } catch {
    /* ignore */
  }
}
