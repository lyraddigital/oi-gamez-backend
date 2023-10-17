import { CORS_ALLOWED_ORIGINS } from "./cors-allowed-origin";

export const verifyCorsAllowedOrigin = (): void => {
  if (!CORS_ALLOWED_ORIGINS) {
    throw new Error("CORS_ALLOWED_ORIGINS environment variable is not set");
  }
};
