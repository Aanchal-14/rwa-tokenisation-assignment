import { Router } from "express";
import { balanceController } from "../controller/token.controller.js";

const router = Router();

router.get("/balance/:address", balanceController);

export default router;
