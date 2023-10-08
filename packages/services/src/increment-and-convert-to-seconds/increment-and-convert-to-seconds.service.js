import { convertFromMillisecondsToSeconds } from "../milliseconds-to-seconds/index.js";

export const incrementAndReturnInSeconds = (
  ttlInMilliseconds,
  incrementInSeconds
) => {
  return (
    convertFromMillisecondsToSeconds(ttlInMilliseconds) + incrementInSeconds
  );
};
