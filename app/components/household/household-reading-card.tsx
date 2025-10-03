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
      <HouseholdReadingCardAttributesValue reading={props.reading} />
      <HouseholdReadingCardAttributesConsumption reading={props.reading} />
      <HouseholdReadingCardAttributesAvgConsumption reading={props.reading} />
      <HouseholdReadingCardAttributesSaving reading={props.reading} />
      <HouseholdReadingCardAttributesReward reading={props.reading} />
    </div>
  );
}

function HouseholdReadingCardAttributesValue(props: {
  reading: HouseholdReading;
}) {
  return (
    <div className="flex flex-row gap-2">
      <p>👀 Value</p>
      <p>—</p>
      <p className="font-semibold">
        {props.reading.value
          ? `${props.reading.value.toFixed(2)} m³`
          : "Undefined"}
      </p>
      {props.reading.imageUrl && (
        <>
          <p>—</p>
          <Link href={props.reading.imageUrl} target="_blank">
            <Button variant="link" className="text-base p-0 m-0 h-auto">
              Image
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

function HouseholdReadingCardAttributesConsumption(props: {
  reading: HouseholdReading;
}) {
  if (props.reading.consumption === undefined) {
    return <></>;
  }

  return (
    <div className="flex flex-row gap-2">
      <p>💦 Consumption</p>
      <p>—</p>
      <p className="font-semibold">{props.reading.consumption.toFixed(2)} m³</p>
    </div>
  );
}

function HouseholdReadingCardAttributesAvgConsumption(props: {
  reading: HouseholdReading;
}) {
  if (props.reading.avgConsumption === undefined) {
    return <></>;
  }

  return (
    <div className="flex flex-row gap-2">
      <p>🌊 Avg. Consumption</p>
      <p>—</p>
      <p className="font-semibold">
        {props.reading.avgConsumption.toFixed(2)} m³
      </p>
    </div>
  );
}

function HouseholdReadingCardAttributesSaving(props: {
  reading: HouseholdReading;
}) {
  if (props.reading.saving === undefined) {
    return <></>;
  }

  return (
    <div className="flex flex-row gap-2">
      <p>💙 Saving</p>
      <p>—</p>
      <p className="font-semibold">{props.reading.saving.toFixed(2)} m³</p>
    </div>
  );
}

function HouseholdReadingCardAttributesReward(props: {
  reading: HouseholdReading;
}) {
  if (props.reading.reward === undefined) {
    return <></>;
  }

  return (
    <div className="flex flex-row gap-2">
      <p>💰 Reward</p>

      <p className="font-semibold">
        {formatEther(BigInt(props.reading.reward))} $B3TR
      </p>
      {props.reading.rewardTx && (
        <>
          <p>—</p>
          <Link
            href={`https://explore-testnet.vechain.org/transactions/${props.reading.rewardTx}`}
            target="_blank"
          >
            <Button variant="link" className="text-base p-0 m-0 h-auto">
              Transaction
            </Button>
          </Link>
        </>
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
