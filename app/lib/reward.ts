import { parseEther } from "viem";

// TODO: Implement
export function calculateReward(
  consumption: number,
  avgConsumption: number
): string {
  return parseEther("2").toString();
}

// TODO: Implement
export async function distributeReward(
  reward: string
): Promise<string | undefined> {
  if (!reward) {
    return undefined;
  }
  return "0xa8e18c1c049693bae2e09267833131c4c56591b82bc5f2d9b3c363a175ecc9c4";
}
