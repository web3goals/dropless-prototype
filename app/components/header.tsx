"use client";

import { appConfig } from "@/config/app";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="container mx-auto flex items-center gap-4 h-16 px-4">
        {/* Left part */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="flex flex-col items-center size-9">
            <Image
              src="/images/icon.png"
              alt="Icon"
              priority={false}
              width="100"
              height="100"
              sizes="100vw"
              className="w-full rounded-full"
            />
          </div>
          <p className="text-foreground font-bold">{appConfig.title}</p>
        </Link>
        {/* Right part */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <Link href={appConfig.links.x} target="_blank">
            <Button size="sm" variant="secondary">
              💙 Built by kiv1n
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
