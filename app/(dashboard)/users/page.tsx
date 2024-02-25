import UserTable from "./table";
import { getAllUser } from "@/server/userAction";
import { Metadata } from "next";
import { AddUserDialog } from "./dialog";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Users",
  description: "user account",
};
export default async function UserDashboard({
  searchParams,
}: {
  searchParams?: { pageSize: string };
}) {
  const pageSize = parseInt((searchParams?.pageSize as string) ?? 10);

  const data = await getAllUser({ pageSize });

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold dark:text-white">Users</h1>

        <AddUserDialog />
      </div>

      <div className="w-full mt-12">
        <UserTable data={data.users} />
      </div>
    </>
  );
}
