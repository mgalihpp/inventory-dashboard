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
import { AddNewUser, EditUser, getUserById } from "@/server/userAction";
import { User } from "@/types/user";
import { $Enums } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export function EditUserDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<User>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    address: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Update the user state based on the input field name
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const [fetchData] = useServerFetch(
    async () => {
      const result = await getUserById(userId);

      return result;
    },
    (result) => {
      if ("error" in result) {
        setError(result.error);
      } else {
        setUser(result);
      }
    }
  );

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const router = useRouter();

  const [runAction, isRunning] = useServerAction(EditUser);

  const handleSubmit = async () => {
    try {
      await runAction({ user, userId }).then((result) => {
        if (result.success) {
          setUser({
            fullname: "",
            username: "",
            email: "",
            password: "",
            avatar: "",
            address: "",
            role: "CUSTOMER",
          });

          toast.success("Success updated user");

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
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Make changes to your user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div>
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="col-span-2 gap-2">
                <Label htmlFor="fullname" className="text-left">
                  Fullname
                </Label>
                <Input
                  id="fullname"
                  name="fullname"
                  className="col-span-3"
                  value={user.fullname ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="email" className="text-left">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="col-span-3"
                  value={user.email ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="password" className="text-left">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="col-span-3"
                  value={user.password ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 text-left sm:col-span-1">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="username"
                  className="col-span-3"
                  value={user.username ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 text-left sm:col-span-1">
                <Label htmlFor="role" className="text-right">
                  Select role
                </Label>
                <Select
                  value={user.role}
                  onValueChange={(value) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      role: value as $Enums.Role,
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="address" className="text-left">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  className="col-span-3"
                  value={user.address ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="avatar" className="text-left">
                  Phone
                </Label>
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  className="col-span-3"
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

export function AddUserDialog() {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<User>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    address: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Update the user state based on the input field name
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const router = useRouter();

  const [runAction, isRunning] = useServerAction(AddNewUser);

  const handleSubmit = async () => {
    try {
      await runAction({ user }).then((result) => {
        if (result.success) {
          setUser({
            fullname: "",
            username: "",
            email: "",
            password: "",
            avatar: "",
            address: "",
            role: "CUSTOMER",
          });

          toast.success("Success created new user");

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
          Add user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            Make your new user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div>
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="col-span-2 gap-2">
                <Label htmlFor="fullname" className="text-left">
                  Fullname
                </Label>
                <Input
                  id="fullname"
                  name="fullname"
                  className="col-span-3"
                  placeholder="User fullname"
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="email" className="text-left">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="col-span-3"
                  placeholder="email@example.com"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="password" className="text-left">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="col-span-3"
                  placeholder="User password"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 text-left sm:col-span-1">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="username"
                  className="col-span-3"
                  placeholder="User username"
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 text-left sm:col-span-1">
                <Label htmlFor="role" className="text-right">
                  Select role
                </Label>
                <Select
                  onValueChange={(value) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      role: value as $Enums.Role,
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="address" className="text-left">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  className="col-span-3"
                  placeholder="User address"
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 gap-2">
                <Label htmlFor="avatar" className="text-left">
                  Avatar
                </Label>
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  className="col-span-3"
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
