import { Router } from "express";
import {
  balanceController,
  setTreasuryController,
  tokenInfoController,
} from "../controller/token.controller.js";

const router = Router();

router.get("/info", tokenInfoController);
router.get("/balance/:address", balanceController);

router.post("/set-treasury", setTreasuryController);

export default router;
