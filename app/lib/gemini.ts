import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY as string,
});

export async function extractReadingValueFromImage(
  image: string
): Promise<number> {
  console.log("Extracting reading value from image...");

  // Define prompt
  const prompt = `
Analyze the provided image of a water meter. Identify the numerical reading in cubic meters, which is typically shown as a sequence of numbers, often including a decimal separator (like a comma or period) that separates the black/white digits from the red digits.

Return only the numerical value, including the decimal part. For example, if the meter shows 00439 in the black/white section and 72 in the red section, you should return 439.72.

If you cannot confidently determine the complete numerical value from the image, return the single word UNDEFINED.
  `;

  // Extract base64 data from the image string
  const data = image.split(",")[1];

  // Prepare contents
  const contents = [
    {
      inlineData: {
        mimeType: "image/png",
        data: data,
      },
    },
    { text: prompt },
  ];

  // Send request
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
  });

  // Check response
  const responseText = response.text;
  if (!responseText) {
    throw new Error("No response from Gemini");
  }

  // Parse response
  const parsedResponseText = parseFloat(responseText.trim());
  if (isNaN(parsedResponseText)) {
    throw new Error(
      `Could not parse numerical value from Gemini response: ${responseText}`
    );
  }

  return parsedResponseText;
}
