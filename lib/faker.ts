import { $Enums } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { User } from "@/types/user";
import { Product } from "@/types/product";
import { Supplier } from "@/types/supplier";

export function createRandomUser(): User {
  return {
    avatar: faker.image.avatar(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    fullname: faker.person.fullName(),
    username: faker.person.firstName(),
    address: faker.location.streetAddress(),
    role: faker.helpers.arrayElement(Object.values($Enums.Role)),
  };
}

export function createRandomProduct(): Product {
  return {
    name: faker.commerce.productName(),
    category: faker.helpers.arrayElement(Object.values($Enums.Category)),
    qty: faker.number.int({ min: 0, max: 100 }),
    price: faker.number.float({ min: 0, max: 100 }),
    status: faker.helpers.arrayElement(Object.values($Enums.Status)),
  };
}

export function createRandomSupplier(): Supplier {
  return {
    name: faker.person.firstName(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
  };
}
