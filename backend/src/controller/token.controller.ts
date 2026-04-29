import { Request, Response, NextFunction } from "express";
import { getBalance } from "../services/token.service.js";

export async function balanceController(req: Request, res: Response, next: NextFunction) {
  try {
    const address = String(req.params.address);
    const balance = await getBalance(address);
    res.json({ address, balance });
  } catch (e) {
    next(e);
  }
}
