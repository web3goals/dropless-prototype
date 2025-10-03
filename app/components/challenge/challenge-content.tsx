import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function ChallengeContent(props: { className?: ClassValue }) {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center gap-3 bg-card border rounded-lg px-3 py-4",
        props.className
      )}
    >
      <Avatar className="size-10">
        <AvatarFallback className="text-base bg-primary">⌛</AvatarFallback>
      </Avatar>
      <h4 className="text-xl tracking-tight text-balance text-center">
        Soon, stay in touch...
      </h4>
    </div>
  );
}
