import { Household as HouseholdModel } from "@/mongodb/models/household";
import { HouseholdReading } from "@/types/household";
import { ClassValue } from "clsx";
import EntityList from "../entity-list";
import { HouseholdReadingCard } from "./household-reading-card";

export function HouseholdReadingList(props: {
  household: HouseholdModel;
  className?: ClassValue;
}) {
  return (
    <EntityList<HouseholdReading>
      entities={[...props.household.readings.toReversed()]}
      renderEntityCard={(reading, index) => (
        <HouseholdReadingCard key={index} reading={reading} />
      )}
      noEntitiesText="No readings yet"
      className={props.className}
    />
  );
}
