import { ObjectId } from "mongodb";

export class Household {
  constructor(
    public created: Date,
    public owner: string, // Owner's wallet address, lowercase
    public size: number,
    public country: string,
    public readings: {
      created: Date;
      value: number;
      consumption?: number;
      avgConsumption?: number;
      reward?: string;
      rewardTxHash?: string;
    }[],
    public _id?: ObjectId
  ) {}
}
