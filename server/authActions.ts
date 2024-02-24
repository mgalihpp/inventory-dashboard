"use server";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import { deleteCookie, setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { PrismaClient, User } from "@prisma/client";

export async function LoginAction(formData: FormData) {
  const emailEntry = formData.get("email");
  const passwordEntry = formData.get("password");

  try {
    if (emailEntry !== null && passwordEntry !== null) {
      const email = emailEntry.toString();
      const password = passwordEntry.toString();

      // check is user by email
      const user = await getUserByEmail(email, prisma);

      if (!user) {
        // User not found
        return { error: "User not found" };
      }

      //check verify password
      const passwordMatch = await verifyPassword(password, user.password);

      if (!passwordMatch) {
        return { error: "Invalid credentials" };
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" } // Token expiration time
      );

      // Set cookie with token
      setCookie("token", token, {
        cookies,
        maxAge: 3600,
      });

      return { success: true };
    }
  } catch (error) {
    // Handle the case where either email or password is not found in the form data
    return { error: "Internal Server Error" };
  }
}

export async function LogoutAction() {
  try {
    deleteCookie("token", { cookies });
  } catch (error) {
    return { error: "Internal Server error" };
  }
}

async function getUserByEmail(
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
async function verifyPassword(
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

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}
