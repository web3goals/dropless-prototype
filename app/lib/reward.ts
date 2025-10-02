import { parseEther } from "viem";

// TODO: Implement
export function calculateReward(
  consumption: number | undefined,
  avgConsumption: number | undefined
): string | undefined {
  if (consumption === undefined || avgConsumption === undefined) {
    return undefined;
  }
  return parseEther("2").toString();
}

// TODO: Implement
export async function distributeReward(
  reward: string | undefined
): Promise<string | undefined> {
  if (!reward) {
    return undefined;
  }
  return "0xa8e18c1c049693bae2e09267833131c4c56591b82bc5f2d9b3c363a175ecc9c4";
}
