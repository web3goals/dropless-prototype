import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";
import { Household } from "@/mongodb/models/household";
import { findHouseholds, insertHousehold } from "@/mongodb/services/household";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  try {
    console.log("Getting households...");

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const owner = searchParams.get("owner");

    // Find households
    const households = await findHouseholds({
      owner: owner ? owner.toLowerCase() : undefined,
    });

    return createSuccessApiResponse({ households });
  } catch (error) {
    console.error("Failed to get households:", error);
    return createFailedApiResponse(
      { message: `Failed to get households: ${getErrorMessage(error)}` },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Creating a household...");

    // Define the schema for request body validation
    const bodySchema = z.object({
      owner: z.string().length(42),
      size: z.coerce.number().gt(0),
      country: z.string().min(1),
      reading: z.coerce.number().gt(0),
      readingDate: z.string().min(1),
    });

    // Get and parse request data
    const body = await request.json();
    const bodyParseResult = bodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse(
        {
          message: `Request body invalid: ${JSON.stringify(bodyParseResult)}`,
        },
        400
      );
    }

    // Create and insert household
    const household: Household = {
      created: new Date(),
      owner: bodyParseResult.data.owner.toLowerCase(),
      size: bodyParseResult.data.size,
      country: bodyParseResult.data.country,
      readings: [
        {
          created: new Date(bodyParseResult.data.readingDate),
          value: bodyParseResult.data.reading,
        },
      ],
    };
    household._id = await insertHousehold(household);

    return createSuccessApiResponse({ household });
  } catch (error) {
    console.error("Failed to create a household:", error);
    return createFailedApiResponse(
      { message: `Failed to create a household: ${getErrorMessage(error)}` },
      500
    );
  }
}
