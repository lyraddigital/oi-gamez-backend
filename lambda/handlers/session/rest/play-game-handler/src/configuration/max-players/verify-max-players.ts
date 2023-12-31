import { GAME_SESSION_MAX_PLAYERS } from "./max-players";

export const verifyMaxPlayers = (): void => {
  if (isNaN(GAME_SESSION_MAX_PLAYERS)) {
    throw new Error(`GAME_SESSION_MAX_PLAYERS environment variable is not set, 
        or not set correctly. Make sure it's set as a positive integer.`);
  }
};
