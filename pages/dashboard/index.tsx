import Table from "@/components/table";
import { UploadIcon } from "lucide-react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import prisma from "@/lib/db";
import Sidebar from "@/components/sidebar";

interface DashboardProps {
  data: any;
}

export default function Dashboard({ data }: DashboardProps) {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Sidebar>
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

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
          <Table data={data} />
        </div>
      </Sidebar>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (
  context
) => {
  // Fetch data from your API or any data source
  const data = await prisma?.user.findMany();
  JSON.stringify(data);

  // Pass data as props to the component
  return {
    props: {
      data,
    },
  };
};
