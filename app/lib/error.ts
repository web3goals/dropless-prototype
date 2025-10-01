import { AxiosError } from "axios";
import { toast } from "sonner";

export function handleError(
  error: unknown,
  message?: string,
  disableToast?: boolean
) {
  // Print error
  console.error(error);
  // Display a toast
  if (!disableToast) {
    toast.error("Something went wrong", {
      description: message || getErrorMessage(error),
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
