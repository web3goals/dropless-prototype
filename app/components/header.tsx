"use client";

import { appConfig } from "@/config/app";
import { WalletButton } from "@vechain/vechain-kit";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="container mx-auto flex items-center gap-4 h-16 px-4">
        {/* Left part */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center size-9">
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
          <WalletButton
            mobileVariant="iconDomainAndAssets"
            desktopVariant="iconDomainAndAssets"
          />
        </div>
      </div>
    </header>
  );
}
