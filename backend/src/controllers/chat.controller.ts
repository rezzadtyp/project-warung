import { NextFunction, Request, Response } from "express";
import { getChatsService } from "../services/chat/get-chats.service";
import { getChatHistoryService } from "../services/chat/get-chat-history.service";
import { deleteChatService } from "../services/chat/delete-chat.service";

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "title",
      sortOrder: (req.query.sortOrder as string) || "asc",
      search: (req.query.search as string) || "",
    };

    const chats = await getChatsService(req.user.id, query);

    res.status(200).send(chats);
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const history = await getChatHistoryService(req.user.id, chatId);
    res.status(200).send(history);
  } catch (error) {
    next(error);
  }
};

export const deleteChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const chat = await deleteChatService(req.user.id, chatId);
    res.status(200).send(chat);
  } catch (error) {
    next(error);
  }
};