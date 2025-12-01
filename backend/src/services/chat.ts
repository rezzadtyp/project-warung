import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();

export interface CreateChatParams {
  userId: string;
  openaiThreadId: string;
  title?: string;
}

export interface CreateMessageParams {
  chatId: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatWithMessages {
  id: string;
  title: string;
  openaiThreadId: string;
  createdAt: Date;
  updatedAt: Date;
  messages: {
    id: string;
    role: string;
    content: string;
    createdAt: Date;
  }[];
}

export class ChatService {
  /**
   * Create a new chat conversation
   */
  static async createChat(
    params: CreateChatParams
  ): Promise<{ id: string; title: string }> {
    const { userId, openaiThreadId, title } = params;

    // Generate a title if not provided
    let chatTitle = title;
    if (!chatTitle) {
      chatTitle = `Chat ${new Date().toLocaleDateString()}`;
    }

    const chat = await prisma.chat.create({
      data: {
        userId,
        openaiThreadId,
        title: chatTitle,
      },
    });

    return { id: chat.id, title: chat.title };
  }

  /**
   * Add a message to a chat
   */
  static async addMessage(params: CreateMessageParams): Promise<void> {
    await prisma.message.create({
      data: {
        chatId: params.chatId,
        role: params.role,
        content: params.content,
      },
    });
  }

  /**
   * Get all chats for a user
   */
  static async getUserChats(userId: string): Promise<ChatWithMessages[]> {
    const chats = await prisma.chat.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return chats;
  }

  /**
   * Get a specific chat with messages
   */
  static async getChat(
    chatId: string,
    userId: string
  ): Promise<ChatWithMessages | null> {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return chat;
  }

  /**
   * Update chat title
   */
  static async updateChatTitle(
    chatId: string,
    userId: string,
    title: string
  ): Promise<void> {
    await prisma.chat.updateMany({
      where: {
        id: chatId,
        userId,
      },
      data: { title },
    });
  }

  /**
   * Delete a chat
   */
  static async deleteChat(chatId: string, userId: string): Promise<void> {
    await prisma.chat.deleteMany({
      where: {
        id: chatId,
        userId,
      },
    });
  }

  /**
   * Find chat by OpenAI thread ID
   */
  static async getChatByThreadId(
    openaiThreadId: string
  ): Promise<{ id: string; userId: string } | null> {
    const chat = await prisma.chat.findUnique({
      where: { openaiThreadId },
      select: { id: true, userId: true },
    });

    return chat;
  }

  /**
   * Generate a title for the chat based on the first user message
   */
  static async generateChatTitle(
    firstMessage: string,
    client: OpenAI
  ): Promise<string> {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Generate a short, descriptive title (max 50 characters) for a healthcare chat conversation based on the user's first message. Return only the title, no quotes or extra text.",
          },
          {
            role: "user",
            content: firstMessage,
          },
        ],
        max_tokens: 20,
        temperature: 0.7,
      });

      const title =
        response.choices[0]?.message?.content?.trim() ||
        `Chat ${new Date().toLocaleDateString()}`;
      return title.substring(0, 50); // Ensure max 50 characters
    } catch (error) {
      console.error("Error generating chat title:", error);
      return `Chat ${new Date().toLocaleDateString()}`;
    }
  }
}
