import { convertFromMillisecondsToSeconds } from "../milliseconds-to-seconds/index.js";

export const incrementAndReturnInSeconds = (
  ttlInMilliseconds: number,
  incrementInSeconds: number
): number => {
  return (
    convertFromMillisecondsToSeconds(ttlInMilliseconds) + incrementInSeconds
  );
};
