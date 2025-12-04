import type {
  CreateTransactionDto,
  Transaction,
} from "@/lib/types/transactions";
import api from "../api";

export const createTransaction = async (
  payload: CreateTransactionDto
): Promise<Transaction> => {
  const { data } = await api.post<Transaction>("/tx", payload);
  return data;
};
