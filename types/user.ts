import { User as DefaultUser } from "@prisma/client";

//with id
type UserWithoutTimestamp = Omit<DefaultUser, "createdAt">;
export type UserWithId = Omit<UserWithoutTimestamp, "updateAt">;

//without id

type UserWithoutId = Omit<DefaultUser, "id">;
type UserWithoutCreatedAt = Omit<UserWithoutId, "createdAt">;
export type User = Omit<UserWithoutCreatedAt, "updateAt">;
