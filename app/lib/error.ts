import { AxiosError } from "axios";
import { toast } from "sonner";

export function handleError(
  error: unknown,
  config: {
    toastTitle?: string;
    disableToast?: boolean;
  }
) {
  // Print error
  console.error(error);
  // Display a toast
  if (!config.disableToast) {
    const description = getErrorMessage(error);
    toast.error(config.toastTitle || "Something went wrong", {
      description:
        description.length > 240
          ? description.substring(0, 240) + "..."
          : description,
      duration: 10_000,
    });
  }
}

export function getErrorMessage(error: unknown): string {
  let message = JSON.stringify(error, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
  if (error instanceof Error) {
    message = error.message;
  }
  if (error instanceof AxiosError) {
    message = JSON.stringify({
      status: error.response?.status,
      data: error.response?.data,
    });
  }
  return message;
}
