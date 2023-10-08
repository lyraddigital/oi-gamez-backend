import { CORS_ALLOWED_ORIGINS } from "./cors-allowed-origin.js";

export const verifyCorsAllowedOrigin = () => {
  if (!CORS_ALLOWED_ORIGINS) {
    throw new Error("CORS_ALLOWED_ORIGINS environment variable is not set");
  }
};
