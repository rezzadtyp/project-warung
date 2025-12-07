import prisma from "../../prisma";

export const deleteChatService = async (userId: string, chatId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    await prisma.chat.delete({
      where: { id: chatId },
    });

    return {
      message: "Chat deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};
