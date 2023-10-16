export const convertFromMillisecondsToSeconds = (
  epochMilliseconds: number
): number => {
  return Math.floor(epochMilliseconds / 1000);
};
