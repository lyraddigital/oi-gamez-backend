import { convertFromMillisecondsToSeconds } from "../milliseconds-to-seconds";

export const incrementAndReturnInSeconds = (
  ttlInMilliseconds: number,
  incrementInSeconds: number
): number => {
  return (
    convertFromMillisecondsToSeconds(ttlInMilliseconds) + incrementInSeconds
  );
};
