import type { ChatListResponse, GetChatsParams } from "@/lib/types/chat";
import api from "../api";

export const getChats = async (
  params: GetChatsParams = {}
): Promise<ChatListResponse> => {
  const { data } = await api.get<ChatListResponse>("/chat", {
    params,
  });
  return data;
};
