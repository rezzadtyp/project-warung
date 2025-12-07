import { Router } from "express";
import {
  deleteChat,
  getChatHistory,
  getChats,
} from "../controllers/chat.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/", verifyToken, getChats);
router.get("/:chatId", verifyToken, getChatHistory);
router.delete("/:chatId", verifyToken, deleteChat);

export default router;
