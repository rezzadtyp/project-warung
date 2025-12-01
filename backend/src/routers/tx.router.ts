import { Router } from "express";
import { createTx, getTxs, updateTx } from "../controllers/tx.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/", verifyToken, getTxs);
router.post("/", verifyToken, createTx);
router.put("/:txId", verifyToken, updateTx);

export default router;
