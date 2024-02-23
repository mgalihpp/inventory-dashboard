import UserTable from "@/components/table/usertable";
import { getAllUser } from "@/server/userAction";
import { UploadIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "user account",
};
export default async function Dashboard() {
  const data = await getAllUser();

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>

        <button
          className="p-2 rounded-md bg-blue-400 text-white font-semibold 
          flex gap-2 text-sm
          "
        >
          <UploadIcon className="h-4 w-4 self-center" />
          Add Data
        </button>
      </div>

      <div className="w-full mt-12">
        <UserTable users={data.users} totalCount={data.totalCount} />
      </div>
    </>
  );
}
