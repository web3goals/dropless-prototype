import { HouseholdReading } from "@/types/household";
import { ClassValue } from "clsx";
import Link from "next/link";
import { formatEther } from "viem";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

// TODO: Add share button
// TODO: Display reading image url
export function HouseholdReadingCard(props: {
  reading: HouseholdReading;
  className?: ClassValue;
}) {
  return (
    <div className="w-full flex flex-row gap-4 bg-card border rounded-lg p-6">
      <Avatar className="size-16">
        <AvatarFallback className="text-xl bg-primary">💧</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="text-xl tracking-tight text-balance">
          Reading for{" "}
          {new Date(props.reading.created).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </h4>
        <div className="flex flex-col gap-2 mt-2">
          <p>
            🔢 Value —{" "}
            <span className="font-semibold">{props.reading.value} m³</span>
          </p>
          {props.reading.consumption && (
            <p>
              🚰 Consumption —{" "}
              <span className="font-semibold">
                {props.reading.consumption} m³ / day
              </span>
            </p>
          )}
          {props.reading.avgConsumption && (
            <p>
              ℹ️ Avg.consumption —{" "}
              <span className="font-semibold">
                {props.reading.avgConsumption} m³ / day
              </span>
            </p>
          )}
          {props.reading.reward && props.reading.rewardTxHash && (
            <p>
              🪙 Reward — {formatEther(BigInt(props.reading.reward))} $B3TR —{" "}
              <Link
                href={`https://explore-testnet.vechain.org/transactions/${props.reading.rewardTxHash}`}
                target="_blank"
              >
                <Button variant="link" className="text-base p-0 m-0 h-auto">
                  Transaction
                </Button>
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
