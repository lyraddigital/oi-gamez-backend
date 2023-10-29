import { ValidationResult } from "@oigamez/validators";

export const validateOptionId = (optionId?: string): ValidationResult => {
  if (!optionId) {
    return {
      isSuccessful: false,
      errorMessages: ["Option id could not be found. Make sure you've sent it"],
    };
  }

  return { isSuccessful: true, errorMessages: [] };
};
