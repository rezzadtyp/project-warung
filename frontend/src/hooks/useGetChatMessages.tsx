import api from "@/api/api";
import { useState } from "react";

export interface MessageType {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  role: "user" | "assistant";
}

const useGetChatMessages = (chatId: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMessages = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/chat/${chatId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, refetch: getMessages };
};

export default useGetChatMessages;
