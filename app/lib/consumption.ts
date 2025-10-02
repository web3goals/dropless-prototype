// TODO: Implement
export function calculateConsumption(
  readingBefore: number | undefined,
  readingAfter: number | undefined
): number | undefined {
  if (readingBefore === undefined || readingAfter === undefined) {
    return undefined;
  }
  return 20 / 30;
}

// TODO: Implement
export function calculateAvgConsumption(
  householdSize: number,
  householdCountry: string
): number | undefined {
  return (householdSize * 12) / 30;
}
