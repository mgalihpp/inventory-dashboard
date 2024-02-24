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
import { ProductWithId } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { EditProductDialog } from "./dialog";
import DeleteButton from "@/components/button/deletebtn";
import { DeleteProduct } from "@/server/productAction";

interface props {
  columns: ColumnDef<any, any>[];
  data: any[];
  columnFilter: string;
}

export default function ProductTable({ data }: { data: ProductWithId[] }) {
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
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => (
          <div className="capitalize truncate max-w-48">
            {row.getValue("category")}
          </div>
        ),
      },
      {
        accessorKey: "qty",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Quantity" />
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("qty")}</div>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("price"));

          // Format the amount as a dollar amount
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);

          return <div className="capitalize">{formatted}</div>;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const formattedStatus = status.replace(/_/g, " "); // Replace underscores with spaces
          const lowercaseStatus = formattedStatus.toLowerCase(); // Convert to lowercase if needed

          return <div className="capitalize">{lowercaseStatus}</div>;
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => {
          const product = row.original;

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
                    navigator.clipboard.writeText(product.id);
                    toast(`Copied product ID: ${product.id}`);
                  }}
                >
                  Copy product ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <EditProductDialog productId={product.id} />
                <DropdownMenuItem>View product details</DropdownMenuItem>
                <DeleteButton deleteAction={DeleteProduct} id={product.id}/>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    data: data,
    columnFilter: "name",
  };

  return <DataTable {...props} />;
}
