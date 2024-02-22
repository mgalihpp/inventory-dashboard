import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await prisma?.$connect();

    switch (req.method) {
      case "POST": {
        const { name, address, phone } = await req.body;

        if (!name || !address || !phone)
          return res
            .status(400)
            .json({ msg: "Please input name, address, and phone" });

        await prisma.supplier.create({
          data: {
            name,
            address,
            phone,
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
