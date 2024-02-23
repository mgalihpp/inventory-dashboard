"use client";

import { ChangeEvent, useState } from "react";
import { UploadIcon } from "lucide-react";
import { Product } from "@prisma/client";
import { useServerAction } from "@/hooks/useServerActions";
import { useRouter } from "next/navigation";
import { AddNewProduct } from "@/server/productAction";

type ExtendedProduct = Omit<Product, "id">;

export default function AddProduct() {
  const [open, setOpen] = useState(false);

  const [product, setProduct] = useState<ExtendedProduct>({
    name: "",
    category: "drink",
    qty: 0,
    price: 0,
    status: "AVAILABLE",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Check if the name is either "qty" or "price"
    if (name === "qty" || name === "price") {
      // Parse the value to ensure it's a number
      const numericValue = parseFloat(value);
      // Update the state only if the parsed value is a valid number
      if (!isNaN(numericValue)) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: numericValue,
        }));
      } else {
        // Handle invalid input
      }
    } else {
      // For other fields, update the state as usual
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const router = useRouter();

  const [runAction, isRunning] = useServerAction(AddNewProduct);

  const handleSubmit = async () => {
    try {
      await runAction({
        product,
      }).then((result) => {
        if (result.success) {
          setProduct({
            name: "",
            category: "drink",
            qty: 0,
            price: 0,
            status: "AVAILABLE",
          });

          setOpen(false);

          router.refresh();
        } else {
          setError(result.error as string);
        }
      });
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <>
      {/* <!-- Modal toggle --> */}
      <button
        onClick={() => setOpen(true)}
        data-modal-target="crud-modal"
        data-modal-toggle="crud-modal"
        className="flex items-center gap-2 justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        type="button"
      >
        <UploadIcon className="w-4 h-4" />
        Add Data
      </button>

      {open && (
        <>
          {/* <!-- Overlay --> */}
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"></div>

          {/* <!-- Main modal --> */}
          <div
            id="crud-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden z-50 fixed flex justify-center items-center w-full md:inset-0 h-dvh max-h-full"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              {/* <!-- Modal content --> */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Product
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="crud-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <form className="p-4 md:p-5" action={handleSubmit}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Product name"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option>Select category</option>
                        <option value="food">Food</option>
                        <option value="drink">Drink</option>
                        <option value="medicine">Medicine</option>
                        <option value="herbs">Herbs</option>
                        <option value="household_equipment">
                          Household Equipment
                        </option>
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="status"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option>Select status</option>
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="NOT_AVAILABLE">NOT AVAILABLE</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="qty"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Quantity
                      </label>
                      <input
                        id="qty"
                        type="number"
                        name="qty"
                        onChange={handleChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Product qty"
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Price $
                      </label>
                      <input
                        id="price"
                        type="number"
                        name="price"
                        onChange={handleChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Product price"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm font-semibold">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isRunning}
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Add new Product
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
