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
import { SupplierWithId } from "@/types/supplier";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { EditSupplierDialog } from "./dialog";

interface props {
  columns: ColumnDef<any, any>[];
  data: any[];
}

export default function SupplierTable({ data }: { data: SupplierWithId[] }) {
  const props: props = {
    columns: [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("name")}</div>
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
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("phone")}</div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => {
          const supplier = row.original;

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
                    navigator.clipboard.writeText(supplier.id);
                    toast(`Copied product ID: ${supplier.id}`);
                  }}
                >
                  Copy product ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <EditSupplierDialog supplierId={supplier.id} />
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
