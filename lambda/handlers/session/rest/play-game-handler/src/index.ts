import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CONNECT_WINDOW_IN_SECONDS } from "@oigamez/configuration";
import { okResponseWithData, fatalErrorResponse } from "@oigamez/responses";
import {
  createUniqueSessionId,
  incrementAndReturnInSeconds,
} from "@oigamez/services";

import { GameSessionToCreate } from "./models";
import { createUniqueGameCode } from "./services";

import { createGameSession, getAllActiveGameCodes } from "./repositories";
import {
  GAME_SESSION_MAX_PLAYERS,
  GAME_SESSION_MIN_PLAYERS,
  validateEnvironment,
} from "./configuration";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const existingGameCodes = await getAllActiveGameCodes();
    const gameCode = createUniqueGameCode(existingGameCodes);
    const sessionId = createUniqueSessionId();
    const ttl = incrementAndReturnInSeconds(
      event.requestContext.requestTimeEpoch,
      CONNECT_WINDOW_IN_SECONDS
    );
    const gameSessionToCreate: GameSessionToCreate = {
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
      "Unknown issue while trying to create a new game session."
    );
  }
};
