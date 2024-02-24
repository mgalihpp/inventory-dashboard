"use client";

import { DataTable } from "@/components/table/DataTable";
import { DataTableColumnHeader } from "@/components/table/DataTableHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserWithId } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { EditUserDialog } from "./dialog";

interface props {
  columns: ColumnDef<any, any>[];
  data: any[];
}

export default function UserTable({ data }: { data: UserWithId[] }) {
  const props: props = {
    columns: [
      {
        accessorKey: "fullname",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Fullname" />
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("fullname")}</div>
        ),
      },
      {
        accessorKey: "username",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Username" />
        ),
        cell: ({ row }) => (
          <div className="truncate">{row.getValue("username")}</div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
          <div className="truncate max-w-56">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("role")}</div>
        ),
      },
      {
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Address" />
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("address")}</div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                    toast(`Copied product ID: ${user.id}`);
                  }}
                >
                  Copy product ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <EditUserDialog userId={user.id} />
                <DropdownMenuItem>View product details</DropdownMenuItem>
                <DropdownMenuItem>Delete product</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    data: data,
  };

  return <DataTable {...props} />;
}
