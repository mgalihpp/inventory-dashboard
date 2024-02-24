"use client";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { PencilLine } from "lucide-react";
import { Product } from "@prisma/client";
import { useServerAction } from "@/hooks/useServerAction";
import { EditProduct, getProductById } from "@/server/productAction";
import { useRouter } from "next/navigation";
import { useServerFetch } from "@/hooks/useServerFetch";

type ExtendedProduct = Omit<Product, "id">;

interface DialogState {
  [productId: string]: boolean;
}

export default function EditButton({ productId }: { productId: string }) {
  const [open, setOpen] = useState<DialogState>({});

  // Function to open dialog for a specific
  const openDialog = (productId: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [productId]: true,
    }));
  };

  // Function to close dialog for a specific
  const closeDialog = (productId: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [productId]: false,
    }));
  };

  const [product, setProduct] = useState<ExtendedProduct>({
    name: "",
    category: "drink",
    price: 0,
    qty: 0,
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

  const [runAction, isRunning] = useServerAction(EditProduct);

  const handleSubmit = async () => {
    try {
      await runAction({ product, productId }).then((result) => {
        if (result.success) {
          setProduct({
            name: "",
            category: "drink",
            price: 0,
            qty: 0,
            status: "AVAILABLE",
          });

          closeDialog(productId);

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

  const props = {
    closeDialog,
    handleChange,
    handleSubmit,
    open,
    error,
    setError,
    productId,
    product,
    setProduct,
    isRunning,
  };

  return (
    <>
      {/* <!-- Modal toggle --> */}
      <button
        onClick={() => openDialog(productId)}
        data-modal-target="crud-modal"
        data-modal-toggle="crud-modal"
        className="flex items-center gap-2 font-medium bg-blue-500 
        text-white px-4 py-2 rounded-md hover:bg-blue-600"
        type="button"
      >
        <PencilLine className="w-4 h-4" />
        Edit
      </button>

      <MainModal {...props} />
    </>
  );
}

function MainModal({
  open,
  productId,
  error,
  setError,
  closeDialog,
  handleSubmit,
  handleChange,
  product,
  setProduct,
  isRunning,
}: {
  open: DialogState;
  productId: string;
  error: string;
  product: ExtendedProduct;
  setProduct: Dispatch<SetStateAction<ExtendedProduct>>;
  setError: Dispatch<SetStateAction<string>>;
  closeDialog: (productId: string) => void;
  handleSubmit: (formdata: FormData) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isRunning: boolean;
}) {
  const [fetchData] = useServerFetch(
    async () => {
      const result = await getProductById(productId);

      return result;
    },
    (result) => {
      if ("error" in result) {
        setError(result.error);
      } else {
        setProduct(result);
      }
    }
  );

  useEffect(() => {
    if (open[productId]) {
      fetchData();
    }
  }, [open]);

  return (
    <>
      {open[productId] && (
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
                    Update Product
                  </h3>
                  <button
                    onClick={() => closeDialog(productId)}
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
                    <div className="col-span-2  text-left">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Product name"
                        value={product.name ?? ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-span-2  text-left sm:col-span-1">
                      <label
                        htmlFor="status"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={product.status}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option>Select status</option>
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="NOT_AVAILABLE">NOT AVAILABLE</option>
                      </select>
                    </div>
                    <div className="col-span-2  text-left sm:col-span-1">
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={product.category}
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
                    <div className="col-span-2  text-left">
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
                        value={product.qty ?? ""}
                        onChange={handleChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Product qty"
                      />
                    </div>
                    <div className="col-span-2  text-left">
                      <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Price $
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        value={product.price ?? ""}
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
                    Update
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
