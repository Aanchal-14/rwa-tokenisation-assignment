# RWA Tokenisation

ERC20 token (EightySixToken / EST) and a Treasury that mints tokens in exchange for POL on Polygon Amoy. Backend exposes read APIs and prepare-tx endpoints for client-side signing, and indexes Deposit/Withdraw events into SQLite.

## What this project does

- **EightySixToken (EST)** — capped ERC20, only the Treasury can mint.
- **Treasury** — mints `value × rate` EST per deposit, with `minTokensOut` slippage protection. Owner can `setRate` and `withdraw`.
- **Backend** — never holds keys; returns unsigned txs for the user's wallet to sign.
- **Indexer** — stores Deposit/Withdraw events in SQLite for per-user history.

## Setup

### 1. Install

```bash
npm install
cd backend && npm install && cd ..
```

### 2. Run the Hardhat unit tests

```bash
npx hardhat test
```

### 3. `backend/.env`

```
RPC_URL=
TOKEN_ADDRESS=0x0e4905358bC629d71d69F3D338990ab3F6D0bDF9
TREASURY_ADDRESS=0xEe652c0a1e288d07AB67ee73638701f48fD8e59E
PRIVATE_KEY=
PORT=3000
DB_PATH=data/indexer.db
```

### 4. Run the backend

```bash
cd backend
npm run dev
```

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/token/balance/:address` | EST balance |
| GET | `/api/treasury/deposit-preview/:amount` | EST you get for X POL |
| POST | `/api/treasury/deposit/prepare` | Unsigned tx for deposit |
| POST | `/api/treasury/withdraw/prepare` | Unsigned tx for withdraw |
| GET | `/api/history/deposits/:address` | User's deposit history |
| GET | `/api/history/withdraws/:address` | User's withdraw history |
