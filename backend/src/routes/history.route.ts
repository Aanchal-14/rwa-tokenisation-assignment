import { Router } from "express";
import {
  userDepositsController,
  userWithdrawsController,
} from "../controller/history.controller.js";

const router = Router();

router.get("/deposits/:address", userDepositsController);
router.get("/withdraws/:address", userWithdrawsController);

export default router;
