import { ValidationResult } from "../models";

export const validateSessionId = (sessionId?: string): ValidationResult => {
  if (!sessionId) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Session id could not be found. Make sure you've sent it",
      ],
    };
  }

  return { isSuccessful: true, errorMessages: [] };
};
