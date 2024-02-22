import UserTable from "@/components/Table/usertable";
import prisma from "@/lib/db";
import type { $Enums } from "@prisma/client";
import { FolderInput, Plus } from "lucide-react";
import { GetServerSideProps } from "next/types";
import Head from "next/head";
import Sidebar from "@/components/sidebar";

// Define a new interface for User data without the password field
interface UserDataWithoutPassword {
  id: string;
  fullname: string | null;
  username: string | null;
  email: string;
  avatar: string | null;
  role: $Enums.Role;
  address: string | null;
}

// Define an interface for the props
interface UsersDashboardProps {
  data: UserDataWithoutPassword[];
}

export default function UsersDashboard({ data }: UsersDashboardProps) {
  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Sidebar>
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Users</h1>

          <div className="flex flex-wrap gap-4">
            <button
              className="p-2 rounded-md bg-blue-400 text-white font-semibold 
            flex gap-2 text-sm items-center
            "
            >
              <FolderInput className="h-4 w-4 self-center" />
              Export Data
            </button>
            <button
              className="p-2 rounded-md bg-green-400 text-white font-semibold 
            flex gap-2 text-sm items-center
            "
            >
              <Plus className="h-4 w-4 self-center" />
              Add Data
            </button>
          </div>
        </div>

        <div className="w-full mt-12">
          <UserTable data={data} />
        </div>
      </Sidebar>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  UsersDashboardProps
> = async (context) => {
  try {
    // Fetch data from Prisma
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        address: true,
      },
    });

    // Return the fetched data as props
    return {
      props: {
        data: users, // Assuming users returned from Prisma already align with the expected shape
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        data: [],
      },
    };
  }
};
