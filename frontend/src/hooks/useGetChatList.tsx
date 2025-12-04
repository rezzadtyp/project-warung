import { useState, useEffect, useCallback } from "react";
import type {
  ChatItem,
  ChatListResponse,
  GetChatsParams,
} from "@/lib/types/chat";
import { getChats } from "@/api/chat/chat";

export const useChats = (initialParams: GetChatsParams = {}) => {
  const [data, setData] = useState<ChatItem[]>([]);
  const [meta, setMeta] = useState<ChatListResponse["meta"]>({
    page: initialParams.page ?? 1,
    take: initialParams.take ?? 10,
    total: 0,
  });

  const [params, setParams] = useState<GetChatsParams>(initialParams);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getChats(params);
      setData(res.data);
      setMeta(res.meta);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const updateParams = (newParams: Partial<GetChatsParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  return {
    data,
    meta,
    loading,
    error,
    params,
    updateParams,
    refetch: fetchChats,
  };
};
