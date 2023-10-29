import { UPDATED_CONNECT_WINDOW_IN_SECONDS } from "./updated-connect-window";

export const verifyUpdatedConnectWindowInSeconds = (): void => {
  if (isNaN(UPDATED_CONNECT_WINDOW_IN_SECONDS)) {
    throw new Error(
      `UPDATED_CONNECT_WINDOW_IN_SECONDS environment variable is not set,
       or not set correctly. Make sure it's set as a positive integer.`
    );
  }
};
