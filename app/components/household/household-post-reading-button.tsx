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
import { useWallet } from "@vechain/vechain-kit";
import axios from "axios";
import { ClassValue } from "clsx";
import { CameraIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function HouseholdPostReadingButton(props: {
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
