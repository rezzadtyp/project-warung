import { Router } from "express";
import { getChats } from "../controllers/chat.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/", verifyToken, getChats);

export default router;
