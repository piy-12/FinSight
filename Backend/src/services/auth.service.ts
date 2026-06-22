import prisma from "../config/prisma";
import hashPassword from "../utils/hashPassword";
import comparePassword from "../utils/comparePassword";
import generateToken from "../utils/generateToken";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await comparePassword(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};