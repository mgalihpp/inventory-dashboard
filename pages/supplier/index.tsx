import SupplierTable from "@/components/Table/suppliertable";
import prisma from "@/lib/db";
import { Supplier } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { FolderInput } from "lucide-react";
import Head from "next/head";
import { useState } from "react";
import AddSupplier from "@/components/modal/addsupplier";
import Sidebar from "@/components/sidebar";

// Define an interface for the props
interface SupplierDashboardProps {
  data: Supplier[];
}

export default function SupplierDashboard({ data }: SupplierDashboardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Supplier</title>
      </Head>
      <Sidebar>
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Supplier</h1>

          <div className="flex flex-wrap gap-4">
            <button
              className="p-2 rounded-md bg-blue-400 text-white font-semibold 
            flex gap-2 text-sm items-center
            "
            >
              <FolderInput className="h-4 w-4 self-center" />
              Export Data
            </button>

            <AddSupplier open={modalOpen} onOpenChange={setModalOpen} />
          </div>
        </div>

        <div className="w-full mt-12">
          <SupplierTable data={data} />
        </div>
      </Sidebar>
    </>
  );
}

// export const getStaticProps: GetStaticProps<
//   SupplierDashboardProps
// > = async () => {
//   try {
//     // Fetch data from Prisma
//     const suppliers = await prisma.supplier.findMany();

//     // Return the fetched data as props
//     return {
//       props: {
//         data: suppliers,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return {
//       props: {
//         data: [],
//       },
//     };
//   }
// };

export const getServerSideProps: GetServerSideProps<
  SupplierDashboardProps
> = async (context) => {
  try {
    // Fetch data from Prisma
    const suppliers = await prisma?.supplier.findMany();

    // Return the fetched data as props
    return {
      props: {
        data: suppliers, // Assuming users returned from Prisma already align with the expected shape
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
