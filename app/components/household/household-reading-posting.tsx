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
import {
  ArrowRightIcon,
  CameraIcon,
  Loader2Icon,
  PlusIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function HouseholdReadingPosting(props: {
  onPost: (household: HouseholdModel) => void;
  className?: ClassValue;
}) {
  const { connectedWallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setIsProcessing(true);

      const address = connectedWallet?.address;
      if (!address) {
        toast.warning("No wallet connected");
        return;
      }

      if (!image) {
        toast.warning("No photo taken");
        return;
      }

      const { data } = await axios.post("/api/households/readings", {
        owner: address,
        image: image,
      });
      const household: HouseholdModel = data.data.household;

      props.onPost(household);
      toast.success("Posted");
      setOpen(false);
      setImage(null);
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
          if (!open) {
            setImage(null);
          }
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
          <div className="w-full flex flex-col items-center gap-4 px-4">
            {image ? (
              <>
                <Image
                  src={image}
                  alt="Image"
                  width="100"
                  height="100"
                  sizes="100vw"
                  className="w-full rounded-md"
                />
                <Button
                  variant="secondary"
                  disabled={isProcessing}
                  className="w-full"
                  onClick={() => handleSubmit()}
                >
                  {isProcessing ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <ArrowRightIcon />
                  )}{" "}
                  Post
                </Button>
              </>
            ) : (
              <HouseholdPostReadingCamera
                onCapture={(image) => setImage(image)}
              />
            )}
          </div>
          <DrawerFooter>
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

function HouseholdPostReadingCamera(props: {
  onCapture: (image: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      handleError(error, "Failed to access camera");
    }
  }

  async function takePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/png");

    props.onCapture(image);
  }

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <>
      <video ref={videoRef} autoPlay className="rounded-xl border" />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <Button variant="secondary" className="w-full" onClick={takePhoto}>
        <CameraIcon /> Take Photo
      </Button>
    </>
  );
}
