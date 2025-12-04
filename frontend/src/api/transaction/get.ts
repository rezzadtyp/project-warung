import type {
  GetTransactionsParams,
  TransactionListResponse,
} from "@/lib/types/transactions";
import api from "../api";

export const getTransactions = async (
  params: GetTransactionsParams = {}
): Promise<TransactionListResponse> => {
  const { data } = await api.get<TransactionListResponse>("/tx", {
    params,
  });
  return data;
};
