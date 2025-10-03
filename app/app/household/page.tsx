"use client";

import { HouseholdLoader } from "@/components/household/household-loader";
import { Loading } from "@/components/loading";
import { useWallet } from "@vechain/vechain-kit";

export default function HouseholdPage() {
  const { account } = useWallet();

  if (!account) {
    return <Loading />;
  }

  return <HouseholdLoader />;
}
