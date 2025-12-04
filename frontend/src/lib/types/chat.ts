export interface ChatItem {
  id: string;
  userId: string;
  title: string;
  openaiThreadId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListResponse {
  data: ChatItem[];
  meta: {
    page: number;
    take: number;
    total: number;
  }
}

export interface GetChatsParams {
  take?: number;
  page?: number;
  sortBy?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
}