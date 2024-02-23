"use server";

import prisma from "@/lib/db";
import { Supplier } from "@prisma/client";

interface GetAllSupplierOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterBy?: {
    name?: string;
    // Add more filter options as needed
  };
}

interface GetAllSupplierResult {
  suppliers: Supplier[];
  totalCount: number;
}

// get supplier
export async function getAllSupplier(
  options: GetAllSupplierOptions = {}
): Promise<GetAllSupplierResult> {
  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = "asc",
      filterBy = {},
    } = options;

    const suppliers = await prisma.supplier.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      // orderBy: {
      //   [sortBy]: sortOrder.toUpperCase(), // Sort order can be 'asc' or 'desc'
      // },
      where: {
        // You can add filtering conditions here based on filterBy object
        // Example: filter by name
        name: {
          contains: filterBy.name, // If filterBy.name is provided, only return suppliers whose name contains the specified string
        },
      },
    });

    const totalSupplierCount = await prisma.supplier.count(); // Total count of suppliers

    return {
      suppliers,
      totalCount: totalSupplierCount,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

type ExtendedSupplier = Omit<Supplier, "id">;

export async function AddNewSupplier({
  supplier,
}: {
  supplier: ExtendedSupplier;
}) {
  try {
    const { name, address, phone } = supplier;

    await prisma.supplier.create({
      data: {
        name,
        address,
        phone,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle error
    return { error: "Internal Server Error" };
  }
}
