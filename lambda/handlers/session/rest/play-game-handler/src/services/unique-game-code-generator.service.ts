import { GAME_CODE_LENGTH } from "@oigamez/configuration/game-code-length";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const charactersLength = characters.length;

const createUniqueGameCode = (existingGameCodes: string[]): string => {
  const maxNumberOfTries =
    Math.pow(charactersLength, GAME_CODE_LENGTH) - existingGameCodes.length;

  let currentTryIndex = 0;

  while (currentTryIndex < maxNumberOfTries) {
    let newCode = "";

    for (let i = 0; i < GAME_CODE_LENGTH; i++) {
      newCode += characters[Math.floor(Math.random() * charactersLength)];
    }

    const codeAlreadyExists = existingGameCodes.find((c) => c === newCode);

    if (!codeAlreadyExists) {
      return newCode;
    }

    currentTryIndex++;
  }

  throw new Error(
    "Could not get a new game code. Looks like we've ran out of codes"
  );
};

export default createUniqueGameCode;
