export type HouseholdReading = {
  created: Date;
  value: number;
  consumption?: number;
  avgConsumption?: number;
  reward?: string;
  rewardTxHash?: string;
};
