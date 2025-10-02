import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { calculateConsumption } from "@/lib/consumption";
import { extractReadingFromImage } from "@/lib/gemini";
import { uploadImage } from "@/lib/pinata";
import { distributeReward } from "@/lib/reward";
import { findHouseholds, updateHousehold } from "@/mongodb/services/household";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    console.log("Creating a household reading...");

    // Define the schema for request body validation
    const bodySchema = z.object({
      owner: z.string().length(42),
      image: z.string().min(1),
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

    // Find existing household
    const households = await findHouseholds({
      owner: bodyParseResult.data.owner.toLowerCase(),
    });
    const household = households[0];
    if (!household) {
      return createFailedApiResponse(
        {
          message: "Household not found",
        },
        404
      );
    }

    // Upload reading image to Pinata
    const { url } = await uploadImage(bodyParseResult.data.image);

    // Extract reading value from image
    const value = await extractReadingFromImage(bodyParseResult.data.image);

    // Calculate consumption and average consumption
    const { consumption, avgConsumption, saving } = calculateConsumption();

    // Calculate and distribute reward
    const { reward, rewardTxHash } = await distributeReward();

    // Update household with new reading
    household.readings.push({
      created: new Date(),
      imageUrl: url,
      value,
      consumption,
      avgConsumption,
      saving,
      reward,
      rewardTxHash,
    });
    await updateHousehold(household);

    return createSuccessApiResponse({ household });
  } catch (error) {
    console.error("Failed to create a household reading:", error);
    return createFailedApiResponse(
      { message: "Internal server error, try again later" },
      500
    );
  }
}
