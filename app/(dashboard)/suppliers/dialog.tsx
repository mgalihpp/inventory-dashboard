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
import { useServerAction } from "@/hooks/useServerAction";
import { useServerFetch } from "@/hooks/useServerFetch";
import {
  AddNewSupplier,
  EditSupplier,
  getSupplierById,
} from "@/server/supplierAction";
import { Supplier } from "@/types/supplier";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export function EditSupplierDialog({ supplierId }: { supplierId: string }) {
  const [open, setOpen] = useState(false);

  const [supplier, setSupplier] = useState<Supplier>({
    name: "",
    address: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Update the user state based on the input field name
    setSupplier((prevSupplier) => ({
      ...prevSupplier,
      [name]: value,
    }));
  };

  const [fetchData] = useServerFetch(
    async () => {
      const result = await getSupplierById(supplierId);

      return result;
    },
    (result) => {
      if ("error" in result) {
        setError(result.error);
      } else {
        setSupplier(result);
      }
    }
  );

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const router = useRouter();

  const [runAction, isRunning] = useServerAction(EditSupplier);

  const handleSubmit = async () => {
    try {
      await runAction({ supplier, supplierId }).then((result) => {
        if (result.success) {
          setSupplier({
            name: "",
            address: "",
            phone: "",
          });

          toast.success("Success updated supplier");

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
          <DialogTitle>Edit supplier</DialogTitle>
          <DialogDescription>
            Make changes to your supplier here. Click save when you&apos;re
            done.
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
                  value={supplier.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="address" className="text-left">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  className="col-span-3"
                  value={supplier.address}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="phone" className="text-left">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  className="col-span-3"
                  value={supplier.phone}
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

export function AddSupplierDialog() {
  const [open, setOpen] = useState(false);

  const [supplier, setSupplier] = useState<Supplier>({
    name: "",
    address: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Update the supplier state based on the input field name
    setSupplier((prevSupplier) => ({
      ...prevSupplier,
      [name]: value,
    }));
  };

  const router = useRouter();

  const [runAction, isRunning] = useServerAction(AddNewSupplier);

  const handleSubmit = async () => {
    try {
      await runAction({
        supplier,
      }).then((result) => {
        if (result.success) {
          setSupplier({
            name: "",
            address: "",
            phone: "",
          });

          toast.success("Success created new supplier");

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
          Edit product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add supplier</DialogTitle>
          <DialogDescription>
            Make your new supplier here. Click save when you&apos;re done.
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
                  placeholder="Supplier name"
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="address" className="text-left">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  className="col-span-3"
                  placeholder="Supplier address"
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="phone" className="text-left">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  className="col-span-3"
                  placeholder="Supplier phone"
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
