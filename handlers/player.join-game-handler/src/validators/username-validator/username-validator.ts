import { ValidationResult } from "@oigamez/validators";

export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return {
      isSuccessful: false,
      errorMessages: ["Username is required"],
    };
  } else if (username.length < 2) {
    return {
      isSuccessful: false,
      errorMessages: ["Username must be at least 2 characters"],
    };
  }

  return { isSuccessful: true };
};
