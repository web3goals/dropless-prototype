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
    // TODO: Add try...catch
    const { url } = await uploadImage(bodyParseResult.data.image);

    // Extract reading value from image
    // TODO: Add try...catch
    const value = await extractReadingValueFromImage(
      bodyParseResult.data.image
    );

    // Calculate consumption and average consumption
    const { consumption, avgConsumption, impact, saving, reward } =
      calculateReward();

    // Send reward if applicable
    let rewardTx: string | undefined = undefined;
    if (
      impact !== undefined &&
      impact !== 0 &&
      reward !== undefined &&
      reward !== "0"
    ) {
      try {
        rewardTx = await sendReward(reward, household.owner, url, impact);
      } catch (error) {
        throw new Error(`Failed to send reward: ${getErrorMessage(error)}`);
      }
    }

    // Update household with new reading
    household.readings.push({
      created: new Date(),
      imageUrl: url,
      value,
      consumption,
      avgConsumption,
      saving,
      reward,
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
