import { handleError } from "@/lib/error";
import { Household } from "@/mongodb/models/household";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@vechain/vechain-kit";
import axios from "axios";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export function HouseholdCreation(props: {
  onCreate: (household: Household) => void;
}) {
  const { connectedWallet } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const formSchema = z.object({
    size: z.coerce.number().gt(0),
    country: z.string().min(1),
    reading: z.coerce.number().gt(0),
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
      });
      const household: Household = data.data.household;

      props.onCreate(household);
      toast.success("Saved");
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        {/* Hero */}
        <div className="w-full flex flex-row gap-4 bg-secondary border rounded-lg p-6">
          <Avatar className="size-16">
            <AvatarFallback className="text-xl bg-primary">🏠</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance text-secondary-foreground">
              Household
            </h1>
            <p className="text-secondary-foreground">
              Enter household information to begin earning rewards for saving
              water
            </p>
          </div>
        </div>
        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-4 items-center mt-8"
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
                  <FormLabel>Current water meter reading (m³) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.42"
                      type="number"
                      disabled={isProcessing}
                      {...field}
                    />
                  </FormControl>
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
      </div>
    </div>
  );
}
