import { Request, Response, NextFunction } from "express";
import {
  listDepositsByUser,
  listWithdrawsByUser,
} from "../services/history.service.js";

export async function userDepositsController(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Number(req.query.limit ?? 50);
    const offset = Number(req.query.offset ?? 0);
    const items = listDepositsByUser(String(req.params.address), limit, offset);
    res.json({ items });
  } catch (e) {
    next(e);
  }
}

export async function userWithdrawsController(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Number(req.query.limit ?? 50);
    const offset = Number(req.query.offset ?? 0);
    const items = listWithdrawsByUser(String(req.params.address), limit, offset);
    res.json({ items });
  } catch (e) {
    next(e);
  }
}
