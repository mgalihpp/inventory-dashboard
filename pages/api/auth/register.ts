import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await prisma?.$connect();

    switch (req.method) {
      case "POST": {
        const { email, password } = await req.body;

        if (!email || !password)
          return res
            .status(400)
            .json({ msg: "Please input email and password" });

        const hashedPassword = await hashPassword(password);

        await prisma?.user.create({
          data: {
            email,
            password: hashedPassword,
            role: "CUSTOMER",
          },
        });

        res.status(201).json("CREATED");
        break;
      }
      default:
        res.status(405).json({ error: "Method not allowed" });
        break;
    }
  } catch (error) {
    console.error("Error:", error);

    // Return appropriate error response
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma?.$disconnect();
  }
}
