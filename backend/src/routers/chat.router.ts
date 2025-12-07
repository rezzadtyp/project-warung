import { Router } from "express";
import { getChatHistory, getChats } from "../controllers/chat.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/", verifyToken, getChats);
router.get("/:chatId", verifyToken, getChatHistory);

export default router;
