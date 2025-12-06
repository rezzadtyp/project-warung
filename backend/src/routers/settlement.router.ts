import { Router } from "express";
import { settleOrder } from "../controllers/settlement.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.post("/settle", verifyToken, settleOrder);

export default router;

