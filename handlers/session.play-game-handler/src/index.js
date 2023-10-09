import { CONNECT_WINDOW_IN_SECONDS } from "@oigamez/configuration";
import { okResponseWithData, fatalErrorResponse } from "@oigamez/responses";
import {
  createUniqueSessionId,
  incrementAndReturnInSeconds,
} from "@oigamez/services";

import { createUniqueGameCode } from "./services/index.js";

import {
  createGameSession,
  getAllActiveGameCodes,
} from "./repositories/index.js";
import {
  GAME_SESSION_MAX_PLAYERS,
  GAME_SESSION_MIN_PLAYERS,
  validateEnvironment,
} from "./configuration/index.js";

export const handler = async (event) => {
  try {
    validateEnvironment();

    const existingGameCodes = await getAllActiveGameCodes();
    const gameCode = createUniqueGameCode(existingGameCodes);
    const sessionId = createUniqueSessionId();
    const ttl = incrementAndReturnInSeconds(
      event.requestContext.requestTimeEpoch,
      CONNECT_WINDOW_IN_SECONDS
    );
    const gameSessionToCreate = {
      sessionId,
      gameCode,
      ttl,
      minPlayers: GAME_SESSION_MIN_PLAYERS,
      maxPlayers: GAME_SESSION_MAX_PLAYERS,
    };

    await createGameSession(gameSessionToCreate);

    return okResponseWithData({ sessionId, gameCode });
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to connect to the game session socket server."
    );
  }
};

(async () => {
  const event = {
    requestContext: {
      requestTimeEpoch: Date.now(),
    },
  };

  const response = await handler(event);

  console.log(response);
})();
