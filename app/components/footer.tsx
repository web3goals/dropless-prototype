"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="sticky bottom-0 z-30 bg-background border-t">
      <div className="container mx-auto flex flex-row gap-2 items-center justify-center py-4 px-4">
        <Link href="/household">
          <Button
            variant={pathname === "/household" ? "default" : "secondary"}
            className="flex flex-col gap-1 h-auto w-28"
          >
            <p>🏠</p>
            <p>Household</p>
          </Button>
        </Link>
        <Link href="/challenge">
          <Button
            variant={pathname === "/challenge" ? "default" : "secondary"}
            className="flex flex-col gap-1 h-auto w-28"
          >
            <p>🏆</p>
            <p>Challenge</p>
          </Button>
        </Link>
        <Link href="/faq">
          <Button
            variant={pathname === "/faq" ? "default" : "secondary"}
            className="flex flex-col gap-1 h-auto w-28"
          >
            <p>❓</p>
            <p>FAQ</p>
          </Button>
        </Link>
      </div>
    </footer>
  );
}
