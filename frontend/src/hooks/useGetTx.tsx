import { getTransactions } from "@/api/transaction/get";
import type {
  GetTransactionsParams,
  Transaction,
  TransactionListResponse,
} from "@/lib/types/transactions";
import { useCallback, useEffect, useRef, useState } from "react";

export const useTransactions = (initialParams: GetTransactionsParams = {}) => {
  const [data, setData] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState<TransactionListResponse["meta"]>({
    page: initialParams.page ?? 1,
    take: initialParams.take ?? 10,
    total: 0,
  });

  const [params, setParams] = useState<GetTransactionsParams>(initialParams);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // Use ref to track if initial fetch has been done
  const hasFetchedRef = useRef(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTransactions(params);
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
    fetchTransactions();
  }, [fetchTransactions]);

  // Memoize updateParams to prevent unnecessary re-renders
  const updateParams = useCallback(
    (newParams: Partial<GetTransactionsParams>) => {
      setParams((prev) => ({
        ...prev,
        ...newParams,
      }));
    },
    []
  );

  return {
    data,
    meta,
    loading,
    error,
    params,
    updateParams,
    refetch: fetchTransactions,
  };
};
