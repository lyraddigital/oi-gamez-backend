import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CONNECT_WINDOW_IN_SECONDS } from "@oigamez/configuration";
import {
  getGameSessionByCode,
  getPlayersInGameSession,
} from "@oigamez/repositories";
import {
  corsBadRequestResponse,
  corsOkResponseWithData,
  fatalErrorResponse,
} from "@oigamez/responses";
import {
  convertFromMillisecondsToSeconds,
  incrementAndReturnInSeconds,
  createUniqueSessionId,
} from "@oigamez/services";

import { validateEnvironment } from "./configuration";
import { JoinGamePayload } from "./models";
import { createPlayer } from "./repositories";
import { runJoinGameRuleSet } from "./rule-sets";
import { validateRequest } from "./validators";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const origin = event?.headers ? event.headers["origin"] : undefined;
    const gameCode = event?.pathParameters
      ? event.pathParameters["code"]
      : undefined;
    const epochTime = event.requestContext.requestTimeEpoch;
    let username: string;

    try {
      const payload = JSON.parse(event.body) as JoinGamePayload;
      username = payload.username;
    } catch {
      username = null;
    }

    const validationResult = validateRequest(origin, gameCode, username);

    if (!validationResult.isSuccessful) {
      return corsBadRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const gameSession = await getGameSessionByCode(gameCode, ttl);
    const existingPlayers = await getPlayersInGameSession(gameSession, ttl);
    const existingUsernames = existingPlayers.map((p) => p.username);
    const ruleResult = runJoinGameRuleSet(
      gameSession,
      username,
      existingUsernames
    );

    if (!ruleResult.isSuccessful) {
      return corsBadRequestResponse(ruleResult.errorMessages);
    }

    const playerSessionId = createUniqueSessionId();
    const playerTTL = incrementAndReturnInSeconds(
      epochTime,
      CONNECT_WINDOW_IN_SECONDS
    );

    await createPlayer(
      gameSession.sessionId,
      playerSessionId,
      username,
      playerTTL
    );

    return corsOkResponseWithData({ sessionId: playerSessionId });
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to check the status of a game code."
    );
  }
};

(async () => {
  const response = await handler({
    headers: { origin: "https://oigamez.com" },
    pathParameters: { code: "XKPE" },
    body: JSON.stringify({ username: "daryl_duck8" }),
    queryStringParameters: {},
    requestContext: {
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
      connectionId: "3940329432049",
    },
    multiValueHeaders: {},
    httpMethod: "PUT",
    isBase64Encoded: false,
    path: "",
    multiValueQueryStringParameters: null,
    stageVariables: null,
    resource: "",
  });

  console.log(response);
})();
