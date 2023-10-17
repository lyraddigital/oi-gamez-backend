import { CORS_ALLOWED_ORIGINS } from "@oigamez/configuration";

import { ValidationResult } from "../models";

export const validateOrigin = (origin: string): ValidationResult => {
  if (!CORS_ALLOWED_ORIGINS.toLowerCase().includes(origin?.toLowerCase())) {
    return {
      isSuccessful: false,
      errorMessages: ["Not allowed to access resource. CORS ERROR"],
    };
  }

  return { isSuccessful: true };
};
