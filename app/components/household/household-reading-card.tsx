import { cn } from "@/lib/utils";
import { HouseholdReading } from "@/types/household";
import { ClassValue } from "clsx";
import { ShareIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatEther } from "viem";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export function HouseholdReadingCard(props: {
  reading: HouseholdReading;
  className?: ClassValue;
}) {
  return (
    <div className="w-full bg-card border rounded-lg px-3 py-4">
      <HouseholdReadingCardHeader reading={props.reading} />
      <HouseholdReadingCardAttributes
        reading={props.reading}
        className="mt-4"
      />
      <HouseholdPostReadingActions className="mt-4" />
    </div>
  );
}

function HouseholdReadingCardHeader(props: { reading: HouseholdReading }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <Avatar className="size-10">
        <AvatarFallback className="text-base bg-primary">💧</AvatarFallback>
      </Avatar>
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
    </div>
  );
}

function HouseholdReadingCardAttributes(props: {
  reading: HouseholdReading;
  className?: ClassValue;
}) {
  return (
    <div className={cn("flex flex-col gap-2", props.className)}>
      <p>
        🔢 Value{" — "}
        <span className="font-semibold">
          {props.reading.value
            ? `${props.reading.value.toFixed(2)} m³`
            : "Unknown"}
        </span>
        {props.reading.imageUrl && (
          <>
            {" — "}
            <Link href={props.reading.imageUrl} target="_blank">
              <Button variant="link" className="text-base p-0 m-0 h-auto">
                Image
              </Button>
            </Link>
          </>
        )}
      </p>
      {props.reading.consumption && (
        <p>
          🚰 Consumption{" — "}
          <span className="font-semibold">
            {props.reading.consumption.toFixed(2)} m³ / day
          </span>
        </p>
      )}
      {props.reading.avgConsumption && (
        <p>
          ℹ️ Avg. consumption{" — "}
          <span className="font-semibold">
            {props.reading.avgConsumption.toFixed(2)} m³ / day
          </span>
        </p>
      )}
      {props.reading.reward && (
        <p>
          🪙 Reward{" — "}
          <span className="font-semibold">
            {formatEther(BigInt(props.reading.reward))} $B3TR
          </span>
          {props.reading.rewardTxHash && (
            <>
              {" — "}
              <Link
                href={`https://explore-testnet.vechain.org/transactions/${props.reading.rewardTxHash}`}
                target="_blank"
              >
                <Button variant="link" className="text-base p-0 m-0 h-auto">
                  Transaction
                </Button>
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}

function HouseholdPostReadingActions(props: { className?: ClassValue }) {
  return (
    <div className={cn(props.className)}>
      <Button onClick={() => toast.info("Soon, stay in touch...")}>
        <ShareIcon /> Share
      </Button>
    </div>
  );
}
