import {
  validateGameCode,
  validateOrigin,
  ValidationResult,
} from "@oigamez/validators";

const validateRequest = (
  origin?: string,
  gameCode?: string
): ValidationResult => {
  const originValidationResult = validateOrigin(origin);

  if (!originValidationResult.isSuccessful) {
    return originValidationResult;
  }

  const gameCodeValidationResult = validateGameCode(gameCode);

  if (!gameCodeValidationResult.isSuccessful) {
    return gameCodeValidationResult;
  }

  return { isSuccessful: true, errorMessages: [] };
};

export default validateRequest;
