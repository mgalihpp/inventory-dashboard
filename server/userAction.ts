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

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: {
        id: isUser.id,
      },
      data: {
        fullname: fullname ?? isUser.fullname,
        username: username ?? isUser.username,
        email: email ?? isUser.email,
        password: hashedPassword ?? isUser.password,
        address: address ?? isUser.address,
        avatar: avatar ?? isUser.avatar,
        role: role ?? isUser.role,
      },
    });
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

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}
