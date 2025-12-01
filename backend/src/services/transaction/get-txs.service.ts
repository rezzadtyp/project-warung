import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import { PaginationQueryParams } from "../../types/pagination.type";

interface GetTxsQueryParams extends PaginationQueryParams {
  search?: string;
}

export const getTxsService = async (
  userId: string,
  query: GetTxsQueryParams
) => {
  try {
    const { take, page, sortBy, sortOrder, search } = query;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const where: Prisma.TransactionWhereInput = {};

    if (search) {
      where.txHash = {
        contains: search,
        mode: "insensitive",
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        ...where,
      },
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await prisma.transaction.count({
      where: {
        userId: user.id,
        ...where,
      },
    }); 

    return {
      data: transactions,
      meta: {
        page,
        take,
        total,
      },
    };
  } catch (error) {
    throw error;
  }
};
