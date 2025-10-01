import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { handleError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { Household as HouseholdModel } from "@/mongodb/models/household";
import { HouseholdReading } from "@/types/household";
import { useWallet } from "@vechain/vechain-kit";
import axios from "axios";
import { ClassValue } from "clsx";
import { CameraIcon, Loader2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { formatEther } from "viem";
import EntityList from "../entity-list";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export function Household(props: {
  household: HouseholdModel;
  onUpdate: (household: HouseholdModel) => void;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <HouseholdHero household={props.household} />
        <HouseholdPostReadingButton className="mt-4" onPost={props.onUpdate} />
        <HouseholdReadingList household={props.household} className="mt-4" />
      </div>
    </div>
  );
}

function HouseholdHero(props: { household: HouseholdModel }) {
  const rewards = props.household.readings.reduce((sum, reading) => {
    if (reading.reward) {
      return sum + BigInt(reading.reward);
    }
    return sum;
  }, BigInt(0));

  return (
    <div className="w-full flex flex-row gap-4 bg-secondary border rounded-lg p-6">
      <Avatar className="size-16">
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

function HouseholdPostReadingButton(props: {
  onPost: (household: HouseholdModel) => void;
  className?: ClassValue;
}) {
  const { connectedWallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit() {
    try {
      setIsProcessing(true);

      const address = connectedWallet?.address;
      if (!address) {
        toast.warning("No wallet connected");
        return;
      }

      // TODO: Use real data
      const reading = "2.05";

      const { data } = await axios.post("/api/households/readings", {
        owner: address,
        reading: reading,
      });
      const household: HouseholdModel = data.data.household;

      props.onPost(household);
      toast.success("Saved");
      setOpen(false);
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!isProcessing) {
          setOpen(open);
        }
      }}
    >
      <DrawerTrigger asChild>
        <Button className={cn("w-full", props.className)}>
          <PlusIcon /> Post Reading
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Post reading</DrawerTitle>
            <DrawerDescription>
              Take a photo of your water meter so the app can send you a reward
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              variant="secondary"
              disabled={isProcessing}
              onClick={() => handleSubmit()}
            >
              {isProcessing ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <CameraIcon />
              )}{" "}
              Take Photo
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isProcessing}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function HouseholdReadingList(props: {
  household: HouseholdModel;
  className?: ClassValue;
}) {
  return (
    <EntityList<HouseholdReading>
      entities={[...props.household.readings.toReversed()]}
      renderEntityCard={(reading, index) => (
        <HouseholdReadingCard key={index} reading={reading} />
      )}
      noEntitiesText="No readings yet"
      className={props.className}
    />
  );
}

function HouseholdReadingCard(props: {
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
