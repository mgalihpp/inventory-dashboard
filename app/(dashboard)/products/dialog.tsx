"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerAction } from "@/hooks/useServerAction";
import { useServerFetch } from "@/hooks/useServerFetch";
import { createRandomProduct } from "@/lib/faker";
import {
  AddNewProduct,
  EditProduct,
  getProductById,
} from "@/server/productAction";
import { Product } from "@/types/product";
import { $Enums } from "@prisma/client";
import { Loader2, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export function EditProductDialog({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);

  const [product, setProduct] = useState<Product>({
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
    if (open) {
      fetchData();
    }
  }, [open]);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="relative flex cursor-default select-none items-center justify-start 
          rounded-sm px-2 text-sm outline-none transition-colors 
          focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none 
          data-[disabled]:opacity-50 w-full"
        >
          Edit product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div>
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="col-span-2 gap-2">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  value={product.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 text-left sm:col-span-1">
                <Label htmlFor="category" className="text-right">
                  Select category
                </Label>
                <Select
                  value={product.category}
                  onValueChange={(value) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      category: value as $Enums.Category,
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="drink">Drink</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="herbs">Herbs</SelectItem>
                    <SelectItem value="household_equipment">
                      Household Equipment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 text-left sm:col-span-1">
                <Label htmlFor="status" className="text-right">
                  Select status
                </Label>
                <Select
                  value={product.status}
                  onValueChange={(value) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      status: value as $Enums.Status,
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="NOT_AVAILABLE">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="qty" className="text-left">
                  Quantity
                </Label>
                <Input
                  id="qty"
                  name="qty"
                  className="col-span-3"
                  value={product.qty}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="price" className="text-left">
                  Price $
                </Label>
                <Input
                  id="price"
                  name="price"
                  className="col-span-3"
                  value={product.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isRunning}>
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AddProductDialog() {
  const [open, setOpen] = useState(false);

  const [product, setProduct] = useState<Product>({
    name: "",
    category: "food",
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
      // const product = createRandomProduct();

      await runAction({
        product,
      }).then((result) => {
        if (result.success) {
          setProduct({
            name: "",
            category: "food",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="flex items-center gap-2 justify-center text-white 
          bg-green-500 hover:bg-green-600 focus:ring-2 focus:outline-none 
          focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
          dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          <UploadIcon className="w-4 h-4" />
          Add product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription>
            Make your new product here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div>
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="col-span-2 gap-2">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  placeholder="Product name"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 text-left sm:col-span-1">
                <Label htmlFor="category" className="text-right">
                  Select category
                </Label>
                <Select
                  onValueChange={(value) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      category: value as $Enums.Category,
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="drink">Drink</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="herbs">Herbs</SelectItem>
                    <SelectItem value="household_equipment">
                      Household Equipment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 text-left sm:col-span-1">
                <Label htmlFor="status" className="text-right">
                  Select status
                </Label>
                <Select
                  onValueChange={(value) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      status: value as $Enums.Status,
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="NOT_AVAILABLE">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="qty" className="text-left">
                  Quantity
                </Label>
                <Input
                  id="qty"
                  name="qty"
                  className="col-span-3"
                  placeholder="Product quantity"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="price" className="text-left">
                  Price $
                </Label>
                <Input
                  id="price"
                  name="price"
                  className="col-span-3"
                  placeholder="Product price"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isRunning}>
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
