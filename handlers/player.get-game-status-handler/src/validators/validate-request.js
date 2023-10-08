import { validateGameCode, validateOrigin } from "@oigamez/validators";

const validateRequest = (origin, gameCode) => {
  const originValidationResult = validateOrigin(origin);

  if (!originValidationResult.isSuccessful) {
    return originValidationResult;
  }

  const gameCodeValidationResult = validateGameCode(gameCode);

  if (!gameCodeValidationResult.isSuccessful) {
    return gameCodeValidationResult;
  }

  return { isSuccessful: true };
};

export default validateRequest;
