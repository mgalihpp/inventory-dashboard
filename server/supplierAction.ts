"use server";

import prisma from "@/lib/db";
import { Supplier, SupplierWithId } from "@/types/supplier";

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
  suppliers: SupplierWithId[];
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
      // take: pageSize,
      // skip: (page - 1) * pageSize,
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

export async function getSupplierById(supplierId: string) {
  try {
    const user = await prisma.supplier.findFirst({
      where: {
        id: supplierId,
      },
    });

    if (!user) {
      return { error: "Supplier not found" }; // Return an error object
    }

    return user;
  } catch (error) {
    console.error("Error fetching supplier:", error);
    // Handle error
    return { error: "Internal Server Error" }; // Return an error object
  }
}

export async function AddNewSupplier({ supplier }: { supplier: Supplier }) {
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

export async function EditSupplier({
  supplier,
  supplierId,
}: {
  supplier: Supplier;
  supplierId: string;
}) {
  try {
    const { name, address, phone } = supplier;

    const isSupplier = await prisma.supplier.findFirst({
      where: {
        id: supplierId,
      },
    });

    if (!isSupplier) return { error: "Supplier not found" };

    await prisma.supplier.update({
      where: {
        id: isSupplier.id,
      },
      data: {
        name: name ?? isSupplier.name,
        address: address ?? isSupplier.address,
        phone: phone ?? isSupplier.phone,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating supplier:", error);
    // Handle error
    return { error: "Internal Server Error" };
  }
}

export async function DeleteSupplier(supplierId: string) {
  try {
    await prisma.supplier.delete({
      where: {
        id: supplierId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle error
    return { error: "Internal Server Error" };
  }
}
