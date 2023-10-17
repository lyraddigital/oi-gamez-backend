import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CONNECT_WINDOW_IN_SECONDS } from "@oigamez/configuration";
import { okResponseWithData, fatalErrorResponse } from "@oigamez/responses";
import {
  createUniqueSessionId,
  incrementAndReturnInSeconds,
} from "@oigamez/services";

import { GameSessionToCreate } from "./models/index.js";
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
      "Unknown issue while trying to connect to the game session socket server."
    );
  }
};

(async () => {
  const event: APIGatewayProxyEvent = {
    queryStringParameters: {},
    headers: {},
    pathParameters: {},
    body: "",
    requestContext: {
      connectionId: "3940329432049",
      authorizer: null,
      identity: null,
      requestId: "19933884",
      resourceId: "",
      resourcePath: "",
      accountId: "",
      apiId: "api123",
      httpMethod: "PUT",
      path: "/",
      protocol: "websocket",
      stage: "local",
      requestTimeEpoch: Date.now(),
    },
    multiValueHeaders: {},
    httpMethod: "PUT",
    isBase64Encoded: false,
    path: "",
    multiValueQueryStringParameters: null,
    stageVariables: null,
    resource: "",
  };

  const response = await handler(event);

  console.log(response);
})();
