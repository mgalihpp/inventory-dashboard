"use server";

import prisma from "@/lib/db";
import { Product } from "@prisma/client";

interface GetAllProductOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterBy?: {
    name?: string;
    // Add more filter options as needed
  };
}

interface GetAllProductResult {
  products: Product[];
  totalCount: number;
}

// get supplier
export async function getAllProduct(
  options: GetAllProductOptions = {}
): Promise<GetAllProductResult> {
  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = "asc",
      filterBy = {},
    } = options;

    const products = await prisma.product.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      // orderBy: {
      //   [sortBy]: sortOrder.toUpperCase(), // Sort order can be 'asc' or 'desc'
      // },
      where: {
        // You can add filtering conditions here based on filterBy object
        // Example: filter by name
        name: {
          contains: filterBy.name, // If filterBy.name is provided, only return products whose name contains the specified string
        },
      },
    });

    const totalSupplierCount = await prisma.product.count(); // Total count of products

    return {
      products,
      totalCount: totalSupplierCount,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

type ExtendedProduct = Omit<Product, "id">;

export async function AddNewProduct({ product }: { product: ExtendedProduct }) {
  try {
    const { name, category, qty, price, status } = product;

    await prisma.product.create({
      data: {
        name,
        category,
        qty,
        price,
        status,
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

export async function DeleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle error
    return { error: "Internal Server Error" };
  }
}
