export type HouseholdReading = {
  created: Date;
  imageUrl?: string;
  value: number;
  consumption?: number;
  avgConsumption?: number;
  reward?: string;
  rewardTxHash?: string;
};
