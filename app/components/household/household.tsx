import { Household as HouseholdModel } from "@/mongodb/models/household";
import { HouseholdHero } from "./household-hero";
import { HouseholdReadingPosting } from "./household-reading-posting";
import { HouseholdReadingList } from "./household-reading-list";

export function Household(props: {
  household: HouseholdModel;
  onUpdate: (household: HouseholdModel) => void;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <HouseholdHero household={props.household} />
        <HouseholdReadingPosting className="mt-4" onPost={props.onUpdate} />
        <HouseholdReadingList household={props.household} className="mt-4" />
      </div>
    </div>
  );
}
