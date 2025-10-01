import { DropletIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export function Index() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        {/* Image */}
        <Image
          src="/images/hero.png"
          alt="Hero"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full rounded-md"
        />
        {/* Title, subtitle */}
        <h1 className="text-4xl font-extrabold tracking-tight text-balance text-secondary text-center mt-6">
          Turn saved water into crypto rewards
        </h1>
        <h4 className="text-xl tracking-tight text-balance text-center mt-4">
          Earn $B3TR for consuming less water than the average household
        </h4>
        <p className="text-muted-foreground  text-balance text-center mt-4">
          Powered by VeChain and VeBetterDAO
        </p>
        {/* Action */}
        <Link href="/household">
          <Button className="mt-6">
            <DropletIcon />
            Let&apos;s Save Water!
          </Button>
        </Link>
      </div>
    </div>
  );
}
