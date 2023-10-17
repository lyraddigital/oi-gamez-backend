import {
  ValidationResult,
  validateGameCode,
  validateOrigin,
} from "@oigamez/validators";

import { validateUsername } from "./username-validator";

export const validateRequest = (
  origin: string,
  gameCode: string,
  username: string
): ValidationResult => {
  const originValidationResult = validateOrigin(origin);

  if (!originValidationResult.isSuccessful) {
    return originValidationResult;
  }

  const gameCodeValidationResult = validateGameCode(gameCode);
  const usernameValidationResult = validateUsername(username);
  const errorMessages: string[] = [];

  if (!gameCodeValidationResult.isSuccessful) {
    errorMessages.push(...gameCodeValidationResult.errorMessages);
  }

  if (!usernameValidationResult.isSuccessful) {
    errorMessages.push(...usernameValidationResult.errorMessages);
  }

  if (errorMessages.length > 0) {
    return { isSuccessful: false, errorMessages };
  }

  return { isSuccessful: true };
};
