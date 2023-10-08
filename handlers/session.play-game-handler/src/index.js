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
  CONNECT_WINDOW_IN_SECONDS,
  GAME_SESSION_MAX_PLAYERS,
  GAME_SESSION_MIN_PLAYERS,
  validateEnvironment,
} from "./configuration/index.js";

validateEnvironment();

export const handler = async (event) => {
  try {
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

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId, gameCode }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        errorMessages: [
          "Unknown issue while trying to connect to the game session socket server.",
        ],
      }),
    };
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
