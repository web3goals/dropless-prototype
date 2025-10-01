import { Household as HouseholdModel } from "@/mongodb/models/household";

export function Household(props: { household: HouseholdModel }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        {JSON.stringify(props.household, null, 2)}
      </div>
    </div>
  );
}
