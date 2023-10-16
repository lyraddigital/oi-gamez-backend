import { GAME_SESSION_MIN_PLAYERS } from "./min-players.js";

export const verifyMinPlayers = (): void => {
  if (isNaN(GAME_SESSION_MIN_PLAYERS)) {
    throw new Error(`GAME_SESSION_MIN_PLAYERS environment variable is not set, 
        or not set correctly. Make sure it's set as a positive integer.`);
  }
};
