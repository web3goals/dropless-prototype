import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import {
  calculateAvgConsumption,
  calculateConsumption,
} from "@/lib/consumption";
import { extractReadingFromImage } from "@/lib/gemini";
import { uploadImage } from "@/lib/pinata";
import { calculateReward, distributeReward } from "@/lib/reward";
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
    const readingBefore = household.readings.slice(-1)[0];
    const consumption = calculateConsumption(readingBefore.value || 0, value);
    const avgConsumption = calculateAvgConsumption(
      household.size,
      household.country
    );

    // Calculate and distribute reward
    const reward = calculateReward(consumption, avgConsumption);
    const rewardTxHash = await distributeReward(reward);

    // Update household with new reading
    household.readings.push({
      created: new Date(),
      imageUrl: url,
      value: value,
      consumption,
      avgConsumption,
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
