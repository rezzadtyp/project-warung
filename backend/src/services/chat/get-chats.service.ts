import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import { PaginationQueryParams } from "../../types/pagination.type";

interface GetChatsQueryParams extends PaginationQueryParams {
  search?: string;
}

export const getChatsService = async (
  userId: string,
  query: GetChatsQueryParams
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

    const where: Prisma.ChatWhereInput = {};

    if(search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const chats = await prisma.chat.findMany({
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

    const total = await prisma.chat.count({
      where: {
        userId: user.id,
        ...where,
      },
    });

    return {
      data: chats,
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
