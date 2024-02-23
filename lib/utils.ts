import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

export async function getUserByEmail(
  email: string,
  prisma: PrismaClient
): Promise<User | null> {
  // Logic to retrieve the user record from the database
  const user = await prisma?.user.findUnique({
    where: {
      email: email,
    },
  });

  return user || null;
}

// Function to verify the provided password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
