import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-[calc(100dvh-4rem)] flex items-center justify-center mx-auto">
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>
  );
}
