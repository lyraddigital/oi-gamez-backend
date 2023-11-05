const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const charactersLength = characters.length;
const numberOfCharacters = 4;

export const generateNewCode = (existingGameCodes: string[]): string => {
  const maxNumberOfTries =
    Math.pow(charactersLength, numberOfCharacters) - existingGameCodes.length;

  let currentTryIndex = 0;

  while (currentTryIndex < maxNumberOfTries) {
    let newCode = "";

    for (let i = 0; i < numberOfCharacters; i++) {
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
