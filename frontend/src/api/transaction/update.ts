import type { UpdateTransactionDto } from "@/lib/types/transactions";
import api from "../api";

export const updateTransaction = async (
  txId: string,
  payload: UpdateTransactionDto
): Promise<{ status: string; message: string }> => {
  const { data } = await api.put<{ status: string; message: string }>(
    `/tx/${txId}`,
    payload
  );
  return data;
};
