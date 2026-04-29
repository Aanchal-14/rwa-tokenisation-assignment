import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "./config.js";
import tokenRoutes from "./routes/token.route.js";
import treasuryRoutes from "./routes/treasury.route.js";
import historyRoutes from "./routes/history.route.js";
import { startIndexer, stopIndexer } from "./chain/indexer.js";
import { closeDb } from "./db/client.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/token", tokenRoutes);
app.use("/api/treasury", treasuryRoutes);
app.use("/api/history", historyRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err);
  res.status(500).json({ error: err.message ?? "internal error" });
});

const server = app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});

startIndexer();

function shutdown(signal: string) {
  console.log(`\nReceived ${signal}, shutting down...`);
  stopIndexer();
  server.close(() => {
    closeDb();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
