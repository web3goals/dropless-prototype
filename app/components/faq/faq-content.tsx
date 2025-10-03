import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import Link from "next/link";
import { Button } from "../ui/button";
import { appConfig } from "@/config/app";

export function FaqContent(props: { className?: ClassValue }) {
  return (
    <div
      className={cn("w-full flex flex-col items-center gap-3", props.className)}
    >
      {/* Card */}
      <div className="w-full flex flex-col gap-3 bg-card border rounded-lg px-3 py-4">
        <p className="font-semibold">
          What to do if I have a problem or an idea?
        </p>
        <p>
          Reach out to{" "}
          <Link href={appConfig.links.x} target="_blank">
            <Button variant="link" className="text-base p-0 m-0 h-auto">
              @kiv1n
            </Button>
          </Link>{" "}
          — we&apos;d love to hear from you!
        </p>
      </div>
      {/* Card */}
      <div className="w-full flex flex-col gap-3 bg-card border rounded-lg px-3 py-4">
        <p className="font-semibold">
          Where can I see the project source code?
        </p>
        <p>
          Check out our{" "}
          <Link href={appConfig.links.github} target="_blank">
            <Button variant="link" className="text-base p-0 m-0 h-auto">
              GitHub
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
