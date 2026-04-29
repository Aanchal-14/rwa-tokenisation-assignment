import { Router } from "express";
import {
  depositController,
  depositPreviewController,
  setRateController,
  treasuryInfoController,
  withdrawController,
} from "../controller/treasury.controller.js";

const router = Router();

router.get("/info", treasuryInfoController);
router.get("/deposit-preview/:amount", depositPreviewController);

router.post("/deposit", depositController);
router.post("/set-rate", setRateController);
router.post("/withdraw", withdrawController);

export default router;
