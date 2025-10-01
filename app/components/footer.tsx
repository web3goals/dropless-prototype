"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="sticky bottom-0 z-30 bg-background border-t">
      <div className="container mx-auto flex flex-row gap-2 items-center justify-center h-16 px-4">
        <Link href="/household">
          <Button variant={pathname === "/household" ? "default" : "secondary"}>
            🏠 Household
          </Button>
        </Link>
        <Link href="/challenge">
          <Button variant={pathname === "/challenge" ? "default" : "secondary"}>
            🏆 Challenge
          </Button>
        </Link>
        <Link href="/faq">
          <Button variant={pathname === "/faq" ? "default" : "secondary"}>
            ❓ FAQ
          </Button>
        </Link>
      </div>
    </footer>
  );
}
