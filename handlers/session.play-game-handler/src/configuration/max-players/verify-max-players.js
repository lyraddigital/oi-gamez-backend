import { GAME_SESSION_MAX_PLAYERS } from "./max-players.js";

export const verifyMaxPlayers = () => {
  if (isNaN(GAME_SESSION_MAX_PLAYERS)) {
    throw new Error(`GAME_SESSION_MAX_PLAYERS environment variable is not set, 
        or not set correctly. Make sure it's set as a positive integer.`);
  }
};
