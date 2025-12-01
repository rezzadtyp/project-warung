import prisma from "../../prisma";
import { appConfig } from "../../utils/config";
import jwt from "jsonwebtoken";

export const meService = async (publicKey: string) => {
  try {
    let user = await prisma.user.findUnique({
      where: {
        publicKey,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          publicKey,
        },
      });
    }

    const token = jwt.sign({ id: user.id }, appConfig.jwtSecret!, { expiresIn: "1h" });

    return {
      id: user.id,
      publicKey: user.publicKey,
      token,
    };
  } catch (error) {
    throw error;
  }
};
