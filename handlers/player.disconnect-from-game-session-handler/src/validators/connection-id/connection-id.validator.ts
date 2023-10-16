import { ValidationResult } from "@oigamez/validators";

export const validateConnectionId = (
  connectionId: string
): ValidationResult => {
  if (!connectionId) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Connection id could not be found. Make sure you've sent it",
      ],
    };
  }

  return { isSuccessful: true };
};
