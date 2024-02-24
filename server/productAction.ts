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
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

type ExtendedProduct = Omit<Product, "id">;

export async function getProductById(productId: string) {
  try {
    const user = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!user) {
      return { error: "Product not found" }; // Return an error object
    }

    return user;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Handle error
    return { error: "Internal Server Error" }; // Return an error object
  }
}

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

    // Handle successful product creation
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle error
    return { error: "Internal Server Error" };
  }
}

export async function EditProduct({
  product,
  productId,
}: {
  product: ExtendedProduct;
  productId: string;
}) {
  try {
    const { name, category, qty, price, status } = product;

    const isProduct = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!isProduct) return { error: "Product not found" };

    await prisma.product.update({
      where: {
        id: isProduct.id,
      },
      data: {
        name: name ?? isProduct.name,
        category: category ?? isProduct.category,
        qty: qty ?? isProduct.qty,
        price: price ?? isProduct.price,
        status: status ?? isProduct.status,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
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
