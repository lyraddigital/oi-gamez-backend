import { GAME_CODE_LENGTH } from "@oigamez/configuration";

export const validateGameCode = (gameCode) => {
  const errorMessages = [];

  if (!gameCode) {
    errorMessages.push("Code is required");
  } else {
    const gameCodeRegexStr = `^[A-Z]{${GAME_CODE_LENGTH}}$`;
    const gameCodeRegex = new RegExp(gameCodeRegexStr);
    const isValidGameCode = gameCode.match(gameCodeRegex);

    if (!isValidGameCode) {
      errorMessages.push(`Code must be ${GAME_CODE_LENGTH} uppercase letters`);
    }
  }

  if (errorMessages.length > 0) {
    return { isSuccessful: false, errorMessages };
  }

  return { isSuccessful: true };
};
