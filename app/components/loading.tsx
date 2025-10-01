import { Loader2Icon } from "lucide-react";

export function Loading() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <Loader2Icon className="animate-spin text-primary" />
      </div>
    </div>
  );
}
