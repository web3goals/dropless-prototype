import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";
import { extractReadingValueFromImage } from "@/lib/gemini";
import { uploadImage } from "@/lib/pinata";
import { calculateReward, sendReward } from "@/lib/reward";
import { findHouseholds, updateHousehold } from "@/mongodb/services/household";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    console.log("Posting household reading...");

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
      throw new Error("Household not found");
    }

    // Upload reading image to Pinata
    let url: string;
    try {
      const uploadImageResponse = await uploadImage(bodyParseResult.data.image);
      url = uploadImageResponse.url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${getErrorMessage(error)}`);
    }

    // Extract reading value from image
    let value: number;
    try {
      value = await extractReadingValueFromImage(bodyParseResult.data.image);
    } catch (error) {
      throw new Error(
        `Failed to extract reading value: ${getErrorMessage(error)}`
      );
    }

    // Get current date
    const now = new Date();

    // Calculate consumption and average consumption
    let consumption: number;
    let avgConsumption: number;
    let saving: number;
    let impact: bigint;
    let reward: bigint;
    try {
      const calculateRewardResponse = calculateReward(household, value, now);
      consumption = calculateRewardResponse.consumption;
      avgConsumption = calculateRewardResponse.avgConsumption;
      saving = calculateRewardResponse.saving;
      impact = calculateRewardResponse.impact;
      reward = calculateRewardResponse.reward;
    } catch (error) {
      throw new Error(`Failed to calculate reward: ${getErrorMessage(error)}`);
    }

    // Send reward
    let rewardTx: string | undefined;
    if (reward > BigInt(0)) {
      try {
        rewardTx = await sendReward(reward, household.owner, url, impact);
      } catch (error) {
        throw new Error(`Failed to send reward: ${getErrorMessage(error)}`);
      }
    }

    // Update household with new reading
    household.readings.push({
      created: now,
      imageUrl: url,
      value,
      consumption,
      avgConsumption,
      saving,
      reward: reward.toString(),
      rewardTx,
    });
    await updateHousehold(household);

    return createSuccessApiResponse({ household });
  } catch (error) {
    console.error("Failed to post household reading:", error);
    return createFailedApiResponse(
      {
        message: `Failed to post household reading: ${getErrorMessage(error)}`,
      },
      500
    );
  }
}
