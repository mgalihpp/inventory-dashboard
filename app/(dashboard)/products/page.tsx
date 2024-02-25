import { AddProductDialog } from "./dialog";
import { getAllProduct } from "@/server/productAction";
import { Metadata } from "next";
import ProductTable from "./table";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description: "product",
};
export default async function ProductDashboard({
  searchParams,
}: {
  searchParams?: { pageSize: string };
}) {
  const pageSize = parseInt((searchParams?.pageSize as string) ?? 10);

  const data = await getAllProduct({ pageSize });

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold dark:text-white">Products</h1>

        <AddProductDialog />
      </div>

      <div className="w-full mt-12">
        <ProductTable data={data.products} />
      </div>
    </>
  );
}
