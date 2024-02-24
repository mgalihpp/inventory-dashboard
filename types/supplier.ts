import { Supplier as DefaultSupplier } from "@prisma/client";

//with id
type SupplierWithoutTimestamp = Omit<DefaultSupplier, "createdAt">;
export type SupplierWithId = Omit<SupplierWithoutTimestamp, "updateAt">;

//without id
type SupplierWithoutId = Omit<DefaultSupplier, "id">;
type SupplierWithoutCreatedAt = Omit<SupplierWithoutId, "createdAt">;
export type Supplier = Omit<SupplierWithoutCreatedAt, "updateAt">;
