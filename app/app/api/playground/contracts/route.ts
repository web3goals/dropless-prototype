import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";

export async function POST() {
  try {
    console.log("Using contracts...");

    return createSuccessApiResponse();
  } catch (error) {
    console.error("Failed to use contracts:", error);
    return createFailedApiResponse(
      { message: `Failed to use contracts: ${getErrorMessage(error)}` },
      500
    );
  }
}
