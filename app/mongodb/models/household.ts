import { HouseholdReading } from "@/types/household";
import { ObjectId } from "mongodb";

export class Household {
  constructor(
    public created: Date,
    public owner: string, // Owner's wallet address, lowercase
    public size: number,
    public country: string,
    public readings: HouseholdReading[],
    public _id?: ObjectId
  ) {}
}
