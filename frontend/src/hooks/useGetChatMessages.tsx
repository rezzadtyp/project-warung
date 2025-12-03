import api from "@/api/api";
import { useState } from "react";

export interface MessageType {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  role: "user" | "assistant";
}

const useGetChatMessages = (chatId: string, userId: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMessages = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/chats/${userId}/${chatId}`
      );
      setMessages(response.data.data.messages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, refetch: getMessages };
};

export default useGetChatMessages;
