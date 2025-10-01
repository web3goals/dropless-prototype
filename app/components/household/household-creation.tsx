import { Household } from "@/mongodb/models/household";
import { HouseholdCreationForm } from "./household-creation-form";
import { HouseholdCreationHero } from "./household-creation-hero";

export function HouseholdCreation(props: {
  onCreate: (household: Household) => void;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <HouseholdCreationHero />
        <HouseholdCreationForm onCreate={props.onCreate} className="mt-8" />
      </div>
    </div>
  );
}
