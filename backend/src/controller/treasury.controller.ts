import { Request, Response, NextFunction } from "express";
import {
  depositPreview,
  prepareDeposit,
  prepareWithdraw,
} from "../services/treasury.service.js";

export async function depositPreviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const amount = String(req.params.amount);
    const expectedTokens = await depositPreview(amount);
    res.json({ amountEth: amount, expectedTokens });
  } catch (e) {
    next(e);
  }
}

export async function prepareDepositController(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, amountEth, minTokensOut } = req.body ?? {};
    if (amountEth === undefined) return res.status(400).json({ error: "amountEth required" });
    res.json(await prepareDeposit({ from, amountEth: String(amountEth), minTokensOut }));
  } catch (e) {
    next(e);
  }
}

export async function prepareWithdrawController(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, amountWei } = req.body ?? {};
    if (amountWei === undefined) return res.status(400).json({ error: "amountWei required" });
    res.json(await prepareWithdraw({ from, amountWei: String(amountWei) }));
  } catch (e) {
    next(e);
  }
}
