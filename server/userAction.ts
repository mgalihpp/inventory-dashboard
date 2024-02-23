"use server";

import prisma from "@/lib/db";
import { User } from "@prisma/client";

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
  users: User[];
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
      take: pageSize,
      skip: (page - 1) * pageSize,
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

type ExtendedUser = Omit<User, "id">;

export async function AddNewUser({ user }: { user: ExtendedUser }) {
  try {
    const { fullname, username, email, password, avatar, address, role } = user;

    const isUserEmailExits = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isUserEmailExits) return { error: "User already exits" };

    await prisma.user.create({
      data: {
        fullname,
        username,
        email,
        password,
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
