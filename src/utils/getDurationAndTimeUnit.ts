type TimeUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

const timeUnits: TimeUnit[] = [
  "year",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
];
const timeUnitDurations = [31536000, 2592000, 604800, 86400, 3600, 60, 1];

/**
 * Returns the duration between `timestamp` and now in the best time unit
 * depending on its order of magnitude, and this time unit.
 */
export const getDurationAndTimeUnit = (
  timestamp: number | undefined,
): { duration?: number; timeUnit?: TimeUnit } => {
  if (!timestamp) {
    return {};
  }
  const difference = (new Date().getTime() - timestamp) / 1000;
  for (let i = 0; i < timeUnits.length; i++) {
    const numberOfUnits = Math.floor(difference / timeUnitDurations[i]);
    if (numberOfUnits >= 1) {
      return { duration: numberOfUnits, timeUnit: timeUnits[i] };
    }
  }
  return { duration: 0, timeUnit: "second" };
};
