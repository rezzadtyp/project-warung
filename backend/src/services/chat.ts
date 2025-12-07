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
      // Clean the message - remove extra whitespace
      const cleanMessage = firstMessage.trim();
      
      // If message is very short (like "halo", "hi"), use it directly or a simple title
      if (cleanMessage.length <= 20) {
        // For very short messages, create a simple title
        const lowerMessage = cleanMessage.toLowerCase();
        if (lowerMessage === "halo" || lowerMessage === "hello" || lowerMessage === "hi") {
          return "Greeting";
        }
        // For other short messages, use the message itself (capitalized) if it's reasonable
        if (cleanMessage.length <= 15) {
          return cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
        }
      }

      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a title generator. Generate a short, descriptive title (max 50 characters) for a chat conversation based EXACTLY on the user's first message. Use the actual content and context of the message. Do not invent or add information that is not in the message. Return only the title, no quotes, no extra text, no explanations.",
          },
          {
            role: "user",
            content: `User's first message: "${cleanMessage}"\n\nGenerate a title based on this exact message:`,
          },
        ],
        max_tokens: 30,
        temperature: 0.3, // Lower temperature for more consistent results
      });

      let title =
        response.choices[0]?.message?.content?.trim() ||
        `Chat ${new Date().toLocaleDateString()}`;
      
      // Remove quotes if present
      title = title.replace(/^["']|["']$/g, '');
      
      // If title is too generic or doesn't match, use a fallback
      if (title.length > 50 || title.toLowerCase().includes("casual chat") || title.toLowerCase().includes("video games")) {
        // Use the first part of the message as title
        return cleanMessage.substring(0, 50) || `Chat ${new Date().toLocaleDateString()}`;
      }
      
      return title.substring(0, 50); // Ensure max 50 characters
    } catch (error) {
      console.error("Error generating chat title:", error);
      // Fallback: use first 50 chars of message or default
      const fallback = firstMessage.trim().substring(0, 50) || `Chat ${new Date().toLocaleDateString()}`;
      return fallback;
    }
  }
}
