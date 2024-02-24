import { Product as DefaultProduct } from "@prisma/client";

//with id
type ProductWithoutTimestamp = Omit<DefaultProduct, "createdAt">;
export type ProductWithId = Omit<ProductWithoutTimestamp, "updateAt">;

//without id
type ProductWithoutId = Omit<DefaultProduct, "id">;
type ProductWithoutCreatedAt = Omit<ProductWithoutId, "createdAt">;
export type Product = Omit<ProductWithoutCreatedAt, "updateAt">;
