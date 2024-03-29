"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { User, UserWithId } from "@/types/user";

interface GetAllUserOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterBy?: {
    username?: string;
    // Add more filter options as needed
  };
}

interface GetAllUserResult {
  users: UserWithId[];
  totalCount: number;
}

// get user
export async function getAllUser(
  options: GetAllUserOptions = {}
): Promise<GetAllUserResult> {
  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = "asc",
      filterBy = {},
    } = options;

    const users = await prisma.user.findMany({
      // take: pageSize,
      // skip: (page - 1) * pageSize,
      // orderBy: {
      //   [sortBy]: sortOrder.toUpperCase(), // Sort order can be 'asc' or 'desc'
      // },
      where: {
        // You can add filtering conditions here based on filterBy object
        // Example: filter by name
        username: {
          contains: filterBy.username, // If filterBy.name is provided, only return users whose name contains the specified string
        },
      },
    });

    const totalUsersCount = await prisma.user.count(); // Total count of users

    return {
      users,
      totalCount: totalUsersCount,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return { error: "User not found" }; // Return an error object
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    // Handle error
    return { error: "Internal Server Error" }; // Return an error object
  }
}

export async function AddNewUser({ user }: { user: User }) {
  try {
    const { fullname, username, email, password, avatar, address, role } = user;

    const isUserEmailExits = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isUserEmailExits) return { error: "User already exits" };

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        fullname,
        username,
        email,
        password: hashedPassword,
        address,
        avatar,
        role,
      },
    });
    // Handle successful user creation
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle error
    return { error: "Internal Server Error" };
  }
}

export async function EditUser({
  user,
  userId,
}: {
  user: User;
  userId: string;
}) {
  try {
    const { fullname, username, email, password, address, avatar, role } = user;

    const isUser = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!isUser) return { error: "User not found" };

    // Check if a password is explicitly provided before hashing:
    if (password) {
      const hashedPassword = await hashPassword(password);

      // Update user with hashed password:
      await prisma.user.update({
        where: { id: userId },
        data: {
          fullname: fullname ?? user.fullname,
          username: username ?? user.username,
          email: email ?? user.email,
          password: hashedPassword, // Use hashedPassword if provided
          address: address ?? user.address,
          avatar: avatar ?? user.avatar,
          role: role ?? user.role,
        },
      });
    } else {
      // Update user without modifying the password:
      await prisma.user.update({
        where: { id: userId },
        data: {
          fullname: fullname ?? user.fullname,
          username: username ?? user.username,
          email: email ?? user.email,
          // Exclude password from update data
          address: address ?? user.address,
          avatar: avatar ?? user.avatar,
          role: role ?? user.role,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    // Handle error
    return { error: "Internal Server Error" };
  }
}

export async function DeleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle error
    return { error: "Internal Server Error" };
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
