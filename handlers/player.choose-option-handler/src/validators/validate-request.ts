import {
  validateOrigin,
  validateSessionId,
  ValidationResult,
} from "@oigamez/validators";

import { validateOptionId } from "./option-id/index.js";

export const validateRequest = (
  origin: string,
  gameCode: string,
  optionId: string
): ValidationResult => {
  const originValidationResult = validateOrigin(origin);

  if (!originValidationResult.isSuccessful) {
    return originValidationResult;
  }

  const errorMessages: string[] = [];
  const gameSessionIdValidationResult = validateSessionId(gameCode);
  const optionIdValidationResult = validateOptionId(optionId);

  if (!gameSessionIdValidationResult.isSuccessful) {
    errorMessages.push(...gameSessionIdValidationResult.errorMessages);
  }

  if (!optionIdValidationResult.isSuccessful) {
    errorMessages.push(...optionIdValidationResult.errorMessages);
  }

  return { isSuccessful: errorMessages.length === 0, errorMessages };
};
