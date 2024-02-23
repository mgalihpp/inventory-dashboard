import AddProduct from "@/components/modal/create/addproduct";
import ProductTable from "@/components/table/producttable";
import { getAllProduct } from "@/server/productAction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "product",
};
export default async function ProductDashboard() {
  const data = await getAllProduct();

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold dark:text-white">Products</h1>

        <AddProduct />
      </div>

      <div className="w-full mt-12">
        <ProductTable products={data.products} totalCount={data.totalCount} />
      </div>
    </>
  );
}
