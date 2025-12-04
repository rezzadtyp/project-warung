export const TransactionType = {
  NATIVE: "NATIVE",
  USDT: "USDT",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;

export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  createdAt: string;
  status: TransactionStatus;
  txHash: string | null;
}

export interface CreateTransactionDto {
  amount: number;
  type: TransactionType;
}

export interface UpdateTransactionDto {
  status: TransactionStatus;
  txHash?: string;
}

export interface GetTransactionsParams {
  take?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  meta: {
    page: number;
    take: number;
    total: number;
  };
}
