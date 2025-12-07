import prisma from "../../prisma";

export const getChatHistoryService = async (userId: string, chatId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    return chat.messages;
  } catch (error) {
    throw error;
  }
};
