import { GAME_CODE_LENGTH } from "./game-code-length.js";

export const verifyGameCodeLength = (): void => {
  if (!GAME_CODE_LENGTH) {
    throw new Error("GAME_CODE_LENGTH environment variable is not set");
  }
};
