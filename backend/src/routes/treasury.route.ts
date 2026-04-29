import { Router } from "express";
import {
  depositPreviewController,
  prepareDepositController,
  prepareWithdrawController,
} from "../controller/treasury.controller.js";

const router = Router();

router.get("/deposit-preview/:amount", depositPreviewController);

router.post("/deposit/prepare", prepareDepositController);
router.post("/withdraw/prepare", prepareWithdrawController);

export default router;
