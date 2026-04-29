import { Request, Response, NextFunction } from "express";
import {
  deposit,
  depositPreview,
  getSignerAddress,
  getTreasuryInfo,
  setRate,
  withdraw,
} from "../services/treasury.service.js";

export async function treasuryInfoController(_req: Request, res: Response, next: NextFunction) {
  try {
    const info = await getTreasuryInfo();
    res.json({ ...info, signer: getSignerAddress() });
  } catch (e) {
    next(e);
  }
}

export async function depositPreviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const amount = String(req.params.amount);
    const expectedTokens = await depositPreview(amount);
    res.json({ amountEth: amount, expectedTokens });
  } catch (e) {
    next(e);
  }
}

export async function depositController(req: Request, res: Response, next: NextFunction) {
  try {
    const { amountEth } = req.body ?? {};
    if (amountEth === undefined) return res.status(400).json({ error: "amountEth required" });
    res.json(await deposit(String(amountEth)));
  } catch (e) {
    next(e);
  }
}

export async function setRateController(req: Request, res: Response, next: NextFunction) {
  try {
    const { rate } = req.body ?? {};
    if (rate === undefined) return res.status(400).json({ error: "rate required" });
    res.json(await setRate(String(rate)));
  } catch (e) {
    next(e);
  }
}

export async function withdrawController(req: Request, res: Response, next: NextFunction) {
  try {
    const { amount } = req.body ?? {};
    if (amount === undefined) return res.status(400).json({ error: "amount required" });
    res.json(await withdraw(String(amount)));
  } catch (e) {
    next(e);
  }
}
