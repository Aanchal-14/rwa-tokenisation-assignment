import { Router } from "express";
import {
  depositsController,
  withdrawsController,
} from "../controller/history.controller.js";

const router = Router();

router.get("/deposits", depositsController);
router.get("/deposits/:address", depositsController);

router.get("/withdraws", withdrawsController);

export default router;
