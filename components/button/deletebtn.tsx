"use client";

import { useServerAction } from "@/hooks/useServerAction";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

        toast(` Success Deleting id=${id}`);

        router.refresh();
      } else {
        // Handle error
        console.error(result.error);
      }
    });
  };

  return (
    <button
      onClick={() => handleDelete()}
      className="flex items-center gap-2 font-medium bg-red-500 
      text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </button>
  );
}
