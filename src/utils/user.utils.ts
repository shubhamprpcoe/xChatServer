import { prisma } from "@/config/prismaClient";
import logger from "@/logger";

export const addUserDetails = async (param: any) => {
  try {
    const { userId, email, avatarUrl, lastName, firstName } = param;
    const userDetails = await prisma.userDetails.create({
      data: {
        userId,
        firstName,
        lastName,
        dateOfBirth: null,
        bio: null,
        avatarUrl: avatarUrl ?? null,
      },
    });
    return userDetails;
    logger.info(`User created: ${email}`);
  } catch (error) {
    logger.error(`User Details: ${error}`);
    return null;
  }
};

export const createUser = async (param: {
  name: string;
  email: string;
  lastName?: string;
  firstName?: string;
  avatarUrl?: string;
  userId?: string;
}) => {
  try {
    const { name, email } = param;

    if (!name || !email) {
      return false;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return true;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    await addUserDetails({ userId: user.id, ...param });

    logger.info(`User created: ${email}`);

    return true;
  } catch {
    return false;
  }
};
