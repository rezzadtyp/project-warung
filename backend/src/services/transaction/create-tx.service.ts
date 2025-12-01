import { TransactionType } from "@prisma/client";
import prisma from "../../prisma";

export const createTxService = async (
  userId: string,
  amount: number,
  type: TransactionType
) => {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount,
        type,
      },
    });

    return transaction;
  } catch (error) {
    throw error;
  }
};
