import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await prisma?.$connect();

    switch (req.method) {
      case "POST": {
        const { email, password } = await req.body;

        // check is user by email
        const user = await getUserByEmail(email);

        if (!user) {
          return res.status(404).json({ msg: "User not found" });
        }

        // verify password
        const passwordMatch = await verifyPassword(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ msg: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" } // Token expiration time
        );

        // Set cookie with token
        res.setHeader(
          "Set-Cookie",
          `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
        );

        // Return token to client
        // res.status(200).json({ token });

        res.status(200).json({ message: "Login successful" });

        break;
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma?.$disconnect();
  }
}

async function getUserByEmail(email: string): Promise<User | null> {
  // Logic to retrieve the user record from the database
  const user = await prisma?.user.findUnique({
    where: {
      email: email,
    },
  });

  return user || null;
}

// Function to verify the provided password
async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
