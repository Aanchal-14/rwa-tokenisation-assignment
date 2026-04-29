import { Request, Response, NextFunction } from "express";
import { listDeposits, listWithdraws } from "../services/history.service.js";

export async function depositsController(req: Request, res: Response, next: NextFunction) {
  try {
    const depositer = req.params.address ? String(req.params.address) : undefined;
    res.json({
      items: listDeposits({ depositer, limit: req.query.limit, offset: req.query.offset }),
    });
  } catch (e) {
    next(e);
  }
}

export async function withdrawsController(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      items: listWithdraws({ limit: req.query.limit, offset: req.query.offset }),
    });
  } catch (e) {
    next(e);
  }
}
