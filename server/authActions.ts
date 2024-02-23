"use server";

import { getUserByEmail, verifyPassword } from "@/lib/utils";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { deleteCookie, setCookie } from "cookies-next";
import { cookies } from "next/headers";

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
