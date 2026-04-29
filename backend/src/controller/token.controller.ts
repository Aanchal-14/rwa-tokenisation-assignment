import { Request, Response, NextFunction } from "express";
import { getBalance, getTokenInfo, setTreasury } from "../services/token.service.js";

export async function tokenInfoController(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getTokenInfo());
  } catch (e) {
    next(e);
  }
}

export async function balanceController(req: Request, res: Response, next: NextFunction) {
  try {
    const address = String(req.params.address);
    const balance = await getBalance(address);
    res.json({ address, balance });
  } catch (e) {
    next(e);
  }
}

export async function setTreasuryController(req: Request, res: Response, next: NextFunction) {
  try {
    const { treasury } = req.body ?? {};
    if (!treasury) return res.status(400).json({ error: "treasury required" });
    res.json(await setTreasury(treasury));
  } catch (e) {
    next(e);
  }
}
