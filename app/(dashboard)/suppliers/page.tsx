import AddSupplier from "@/components/modal/create/addsupplier";
import SupplierTable from "@/components/table/suppliertable";
import { getAllSupplier } from "@/server/supplierAction";
import { Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Suppliers",
  description: "supplier",
};
export default async function SupplierDashboard() {
  const data = await getAllSupplier();

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold dark:text-white">Suppliers</h1>

        <AddSupplier />
      </div>

      <div className="w-full mt-12">
        <SupplierTable
          suppliers={data.suppliers}
          totalCount={data.totalCount}
        />
      </div>
    </>
  );
}
