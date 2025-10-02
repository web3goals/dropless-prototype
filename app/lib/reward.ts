import { parseEther } from "viem";

// TODO: Implement
export async function sendReward(): Promise<{
  reward: string | undefined;
  rewardTxHash: string | undefined;
}> {
  return {
    reward: parseEther("4").toString(),
    rewardTxHash:
      "0xa8e18c1c049693bae2e09267833131c4c56591b82bc5f2d9b3c363a175ecc9c4",
  };
}
