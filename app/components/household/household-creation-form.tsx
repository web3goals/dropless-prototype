import { handleError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { Household } from "@/mongodb/models/household";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@vechain/vechain-kit";
import axios from "axios";
import { ClassValue } from "clsx";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export function HouseholdCreationForm(props: {
  onCreate: (household: Household) => void;
  className?: ClassValue;
}) {
  const { connectedWallet } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const formSchema = z.object({
    size: z.coerce.number().gt(0),
    country: z.string().min(1),
    reading: z.coerce.number().gt(0),
    readingDate: z.date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: 0,
      country: "",
      reading: 0,
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Saving household...");
      setIsProcessing(true);

      const address = connectedWallet?.address;
      if (!address) {
        toast.warning("No wallet connected");
        return;
      }

      const { data } = await axios.post("/api/households", {
        owner: address,
        size: values.size,
        country: values.country,
        reading: values.reading,
        readingDate: values.readingDate.toISOString(),
      });
      const household: Household = data.data.household;

      props.onCreate(household);
      toast.success("Saved");
    } catch (error) {
      handleError(error, { toastTitle: "Failed to save household" });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          "w-full flex flex-col gap-4 items-start",
          props.className
        )}
      >
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Number of people *</FormLabel>
              <FormControl>
                <Input
                  placeholder="2"
                  type="number"
                  disabled={isProcessing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Country *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Netherlands"
                  disabled={isProcessing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reading"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Last water meter reading (m³) *</FormLabel>
              <FormControl>
                <Input
                  placeholder="42"
                  type="number"
                  disabled={isProcessing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="readingDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last water meter reading date *</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                captionLayout="dropdown"
                disabled={isProcessing}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" disabled={isProcessing}>
          {isProcessing ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <ArrowRightIcon />
          )}
          Save
        </Button>
      </form>
    </Form>
  );
}
