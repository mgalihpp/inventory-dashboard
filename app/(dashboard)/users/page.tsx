import AddUser from "@/components/modal/create/adduser";
import UserTable from "@/components/table/usertable";
import { getAllUser } from "@/server/userAction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "user account",
};
export default async function UserDashboard() {
  const data = await getAllUser();

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold dark:text-white">Users</h1>

        <AddUser />
      </div>

      <div className="w-full mt-12">
        <UserTable users={data.users} totalCount={data.totalCount} />
      </div>
    </>
  );
}
