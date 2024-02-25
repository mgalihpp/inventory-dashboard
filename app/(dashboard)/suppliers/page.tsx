import SupplierTable from "./table";
import { getAllSupplier } from "@/server/supplierAction";
import { Metadata } from "next";
import { AddSupplierDialog } from "./dialog";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Suppliers",
  description: "supplier",
};
export default async function SupplierDashboard({
  searchParams,
}: {
  searchParams?: { pageSize: string };
}) {
  const pageSize = parseInt((searchParams?.pageSize as string) ?? 10);

  const data = await getAllSupplier({ pageSize });

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold dark:text-white">Suppliers</h1>

        <AddSupplierDialog />
      </div>

      <div className="w-full mt-12">
        <SupplierTable data={data.suppliers} />
      </div>
    </>
  );
}
