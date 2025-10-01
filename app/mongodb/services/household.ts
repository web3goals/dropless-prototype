import { mongodbConfig } from "@/config/mongodb";
import { Household } from "../models/household";
import { getCollection } from "../utils/collection";
import { ObjectId } from "mongodb";

export async function findHouseholds(args?: {
  id?: string;
  owner?: string;
}): Promise<Household[]> {
  console.log("Finding households ...");
  const collection = await getCollection<Household>(
    mongodbConfig.collections.households
  );
  const households = await collection
    .find({
      ...(args?.id !== undefined && { _id: new ObjectId(args.id) }),
      ...(args?.owner !== undefined && { owner: args.owner }),
    })
    .sort({ created: -1 })
    .toArray();
  return households;
}

export async function insertHousehold(household: Household): Promise<ObjectId> {
  console.log("Inserting a household...");
  const collection = await getCollection<Household>(
    mongodbConfig.collections.households
  );
  const insertOneResult = await collection.insertOne(household);
  return insertOneResult.insertedId;
}
