"use client";

import { HouseholdLoader } from "@/components/household/household-loader";
import { Loading } from "@/components/loading";
import { useWallet } from "@vechain/vechain-kit";

export default function HouseholdPage() {
  const { connectedWallet } = useWallet();

  if (!connectedWallet) {
    return <Loading />;
  }

  return <HouseholdLoader />;
}
