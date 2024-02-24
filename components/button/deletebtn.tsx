"use client";

import { useServerAction } from "@/hooks/useServerAction";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function DeleteButton({
  deleteAction,
  id,
}: {
  id: string;
  deleteAction: (
    id: string
  ) => Promise<
    | { success: boolean; error?: undefined }
    | { error: string; success?: undefined }
  >;
}) {
  const [runAction] = useServerAction(deleteAction);

  const router = useRouter();

  const handleDelete = async () => {
    await runAction(id).then((result) => {
      if (result.success) {
        // Handle success

        toast.error(`Success Deleting id=${id}`);

        router.refresh();
      } else {
        // Handle error
        console.error(result.error);
      }
    });
  };

  return (
    <Button
      onClick={() => handleDelete()}
      variant="ghost"
      size="sm"
      type="button"
      className="relative flex cursor-default select-none items-center justify-start 
      rounded-sm px-2 text-sm outline-none transition-colors 
      focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none 
      data-[disabled]:opacity-50 w-full"
    >
      Delete
    </Button>
  );
}
