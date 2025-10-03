import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";

export async function POST() {
  try {
    console.log("Using contracts...");

    return createSuccessApiResponse();
  } catch (error) {
    console.error("Failed to use contracts:", error);
    return createFailedApiResponse(
      { message: "Internal server error, try again later" },
      500
    );
  }
}
