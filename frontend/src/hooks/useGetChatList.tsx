import { getChats } from "@/api/chat/chat";
import type {
  ChatItem,
  ChatListResponse,
  GetChatsParams,
} from "@/lib/types/chat";
import { useCallback, useEffect, useRef, useState } from "react";

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

  // Use ref to track if initial fetch has been done
  const hasFetchedRef = useRef(false);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getChats(params);
      setData(res.data);
      setMeta(res.meta);
      hasFetchedRef.current = true;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Memoize updateParams to prevent unnecessary re-renders
  const updateParams = useCallback((newParams: Partial<GetChatsParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  }, []);

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
