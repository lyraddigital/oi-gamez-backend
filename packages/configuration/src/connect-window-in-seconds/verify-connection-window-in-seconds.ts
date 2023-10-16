import { CONNECT_WINDOW_IN_SECONDS } from "./connection-window-in-seconds.js";

export const verifyConnectionWindowInSeconds = (): void => {
  if (isNaN(CONNECT_WINDOW_IN_SECONDS)) {
    throw new Error(`CONNECT_WINDOW_IN_SECONDS environment variable is not set, 
            or not set correctly. Make sure it's set as a positive integer.`);
  }
};
