export type HouseholdReading = {
  created: Date;
  imageUrl?: string;
  value?: number; // In cubic meters
  consumption?: number; // In cubic meters
  avgConsumption?: number; // In cubic meters
  saving?: number; // In cubic meters
  reward?: string;
  rewardTx?: string;
};
