import convertFromMillisecondsToSeconds from "./milliseconds-to-seconds.service.js";

const incrementAndReturnInSeconds = (ttlInMilliseconds, incrementInSeconds) => {
  return (
    convertFromMillisecondsToSeconds(ttlInMilliseconds) + incrementInSeconds
  );
};

export default incrementAndReturnInSeconds;
