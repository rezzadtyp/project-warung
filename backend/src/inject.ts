import prisma from "./prisma";

const publicKey = "0xdb48e5217cDB49B900fE18753076e1A83fE245eA";

const inject = async () => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        publicKey,
      },
    });

    if (!findUser) {
      await prisma.user.create({
        data: {
          publicKey,
        },
      });
    }

    return findUser;
  } catch (error) {
    console.error("Error injecting user", error);
    throw error;
  }
};

inject();