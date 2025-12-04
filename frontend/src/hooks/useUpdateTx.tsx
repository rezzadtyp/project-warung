import { updateTransaction } from "@/api/transaction/update";
import type { UpdateTransactionDto } from "@/lib/types/transactions";
import { useState } from "react";

export const useUpdateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<{ status: string; message: string } | null>(
    null
  );

  const mutate = async (txId: string, payload: UpdateTransactionDto) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateTransaction(txId, payload);
      setData(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return {
    mutate,
    loading,
    error,
    data,
    reset,
  };
};
