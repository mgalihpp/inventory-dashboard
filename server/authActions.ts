"use server";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import { deleteCookie, setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { PrismaClient, User } from "@prisma/client";

/**
 * Interface representing the response structure for login and logout actions.
 *
 * @property {boolean} [success] - Indicates successful action (true) or undefined on failure.
 * @property {string} [error] - An error message on failure, undefined on success.
 */
interface ActionResponse {
  success?: boolean;
  error?: string;
}

/**
 * Handles user login and authenticates credentials.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @property {string} formData.email - The user's email address.
 * @property {string} formData.password - The user's password.
 * @returns {Promise<ActionResponse>} - A Promise that resolves with:
 *   - On success:
 *     - `{ success: true }`
 *   - On failure:
 *     - `{ error: string }` - An error message indicating the reason for failure.
 *
 * @throws {Error} If an unexpected error occurs during the login process.
 */
export async function LoginAction(formData: FormData): Promise<ActionResponse> {
  const emailEntry = formData.get("email");
  const passwordEntry = formData.get("password");

  try {
    if (emailEntry !== null && passwordEntry !== null) {
      const email = emailEntry.toString();
      const password = passwordEntry.toString();

      /**
       * Find user by email:
       */
      const user = await getUserByEmail(email, prisma);

      if (!user) {
        // User not found:
        return { error: "User not found" };
      }

      /**
       * Verify password:
       */
      const passwordMatch = await verifyPassword(password, user.password);

      if (!passwordMatch) {
        // Invalid credentials:
        return { error: "Invalid credentials" };
      }

      /**
       * Generate JWT token:
       */
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" } // Token expiration time
      );

      /**
       * Set cookie with token:
       */
      setCookie("token", token, {
        cookies,
        maxAge: 3600,
      });

      return { success: true };
    } else {
      // Missing email or password:
      return { error: "Missing email or password" };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { error: "Internal Server Error" }; // Consider providing more specific error messages based on the error type
  }
}

/**
 * Handles user logout and removes the authentication token.
 *
 * @returns {Promise<ActionResponse>} - A Promise that resolves with:
 *   - On success:
 *     - `{ success: true }`
 *   - On failure:
 *     - `{ error: string }` - An error message indicating the reason for failure.
 *
 * @throws {Error} If an unexpected error occurs during logout handling.
 */
export async function LogoutAction(): Promise<ActionResponse> {
  try {
    deleteCookie("token", { cookies });
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: "Internal Server Error" }; // Consider providing more specific error messages based on the error type
  }
}

/**
 * Handles user register and authenticates credentials.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @property {string} formData.email - The user's email address.
 * @property {string} formData.password - The user's password.
 * @returns {Promise<ActionResponse>} - A Promise that resolves with:
 *   - On success:
 *     - `{ success: true }`
 *   - On failure:
 *     - `{ error: string }` - An error message indicating the reason for failure.
 *
 * @throws {Error} If an unexpected error occurs during the register process.
 */
export async function RegisterAction(
  formData: FormData
): Promise<ActionResponse> {
  const emailEntry = formData.get("email");
  const passwordEntry = formData.get("password");
  try {
    if (emailEntry !== null && passwordEntry !== null) {
      const email = emailEntry.toString();
      const password = passwordEntry.toString();

      /**
       * Find user by email:
       */
      const user = await getUserByEmail(email, prisma);

      if (user) {
        // email is already taken:
        return { error: "Email is already taken." };
      }

      const hashedPassword = await hashPassword(password);

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "CUSTOMER",
        },
      });

      return { success: true };
    } else {
      // Missing email or password:
      return { error: "Missing email or password" };
    }
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: "Internal Server Error" }; // Consider providing more specific error messages based on the error type
  }
}

/**
 * Retrieves a user by email address.
 *
 * @param {string} email - The user's email address to search for.
 * @param {PrismaClient} prisma - The Prisma client instance to use for database interaction.
 * @returns {Promise<User | null>} - A Promise that resolves with the user object if found, otherwise null.
 * @throws {Error} If an unexpected error occurs during database communication or user retrieval.
 */
async function getUserByEmail(
  email: string,
  prisma: PrismaClient
): Promise<User | null> {
  try {
    /**
     * Retrieves a single user with the specified email from the database.
     */
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  } catch (error) {
    console.error("Error retrieving user:", error);
    // Re-throw or handle the error appropriately
    throw error;
  }
}

/**
 * Verifies a provided password against a hashed password.
 *
 * @param {string} password - The plain text password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A Promise that resolves with `true` if the passwords match, `false` otherwise.
 * @throws {Error} If an error occurs during password verification (e.g., bcrypt failure).
 */
async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    /**
     * Compares the plain text password with the hashed password using bcrypt.
     */
    const match = await bcrypt.compare(password, hashedPassword);

    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - A Promise that resolves with the hashed password.
 * @throws {Error} If an error occurs during password hashing (e.g., bcrypt failure).
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 10; // Number of salt rounds for bcrypt hashing

    /**
     * Generates a hashed password using bcrypt with the specified salt rounds.
     */
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}
