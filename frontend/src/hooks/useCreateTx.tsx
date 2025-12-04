import { createTransaction } from "@/api/transaction/create";
import type {
  CreateTransactionDto,
  Transaction,
} from "@/lib/types/transactions";
import { useState } from "react";

export const useCreateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<Transaction | null>(null);

  const mutate = async (payload: CreateTransactionDto) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createTransaction(payload);
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
