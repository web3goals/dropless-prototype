import { Household as HouseholdModel } from "@/mongodb/models/household";
import { formatEther } from "viem";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function HouseholdHero(props: { household: HouseholdModel }) {
  const rewards = props.household.readings.reduce((sum, reading) => {
    if (reading.reward) {
      return sum + BigInt(reading.reward);
    }
    return sum;
  }, BigInt(0));

  return (
    <div className="w-full flex flex-row gap-3 bg-secondary border rounded-lg px-3 py-4">
      <Avatar className="size-12">
        <AvatarFallback className="text-xl bg-primary">🏠</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-balance text-secondary-foreground">
          Household
        </h1>
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-secondary-foreground">
            👥 Number of people —{" "}
            <span className="font-semibold">{props.household.size}</span>
          </p>
          <p className="text-secondary-foreground">
            🌍 Country —{" "}
            <span className="font-semibold">{props.household.country}</span>
          </p>
          <p className="text-secondary-foreground">
            🪙 Earned —{" "}
            <span className="font-semibold">{formatEther(rewards)} $B3TR</span>
          </p>
        </div>
      </div>
    </div>
  );
}
