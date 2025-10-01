"use client";

import { handleError } from "@/lib/error";
import { Household as HouseholdModel } from "@/mongodb/models/household";
import { useWallet } from "@vechain/vechain-kit";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loading } from "../loading";
import { Household } from "./household";
import { HouseholdCreation } from "./household-creation";

export function HouseholdLoader() {
  const { connectedWallet } = useWallet();
  const [household, setHousehold] = useState<
    HouseholdModel | null | undefined
  >();

  useEffect(() => {
    console.log("Loading household...");
    setHousehold(undefined);

    const address = connectedWallet?.address;
    if (!address) {
      toast.warning("No wallet connected");
      return;
    }

    axios
      .get("/api/households", {
        params: { owner: address },
      })
      .then(({ data }) => {
        setHousehold(data?.data?.households[0] || null);
      })
      .catch((error) =>
        handleError(error, "Failed to load household, try again later")
      );
  }, [connectedWallet?.address]);

  if (household) {
    return <Household household={household} />;
  }

  if (household === null) {
    return (
      <HouseholdCreation onCreate={(household) => setHousehold(household)} />
    );
  }

  return <Loading />;
}
