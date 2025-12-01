import { TransactionStatus } from "@prisma/client";
import prisma from "../../prisma";

export const updateTxService = async (
  userId: string,
  txId: string,
  status: TransactionStatus,
  txHash?: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: txId, userId: user.id },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (txHash) {
      transaction.txHash = txHash;
    }

    await prisma.transaction.update({
      where: { id: txId },
      data: { status, txHash },
    });

    return {
      status: "OK",
      message: "Transaction updated successfully",
    };
  } catch (error) {
    throw error;
  }
};
