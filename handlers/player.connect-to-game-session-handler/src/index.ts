import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GAME_SESSION_WEBSOCKET_ENDPOINT } from "@oigamez/configuration";
import { sendCommunicationEvent } from "@oigamez/communication";
import {
  badRequestResponse,
  fatalErrorResponse,
  okResponse,
} from "@oigamez/responses";
import { getGameSession, getPlayerBySessionId } from "@oigamez/repositories";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";
import { validateSessionId } from "@oigamez/validators";

import { validateEnvironment } from "./configuration";
import { updatePlayerAndGameSession } from "./repositories";
import { runConnectToGameSessionRuleSet } from "./rule-sets";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const playerSessionId = event.queryStringParameters["sessionId"];
    const connectionId = event.requestContext.connectionId;
    const epochTime = event.requestContext.requestTimeEpoch;
    const validationResult = validateSessionId(playerSessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const player = await getPlayerBySessionId(playerSessionId, ttl);
    const gameSession = await getGameSession(player?.hostSessionId, ttl);
    const ruleResult = runConnectToGameSessionRuleSet(player, gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    await updatePlayerAndGameSession({
      playerSessionId,
      hostSessionId: gameSession.sessionId,
      connectionId,
      gameSessionTTL: gameSession.ttl,
    });

    const hasPreviouslyConnected = !!player.connectionId;
    const canStartGame =
      gameSession.minPlayers <= gameSession.currentNumberOfPlayers + 1;

    // If the player has already connected previously we don't need to
    // notify the game host again. So only do this if this is a first
    // time connection
    if (!hasPreviouslyConnected) {
      await sendCommunicationEvent(
        GAME_SESSION_WEBSOCKET_ENDPOINT,
        gameSession.connectionId,
        "playerJoined",
        {
          username: player.username,
          canStartGame,
        }
      );
    }

    return okResponse();
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to connect to the player socket server."
    );
  }
};

(async () => {
  const response = await handler({
    queryStringParameters: { sessionId: "2aeddad52f4a46879ba9c8e74aaa5686" },
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
    body: "",
    headers: {},
    multiValueHeaders: {},
    httpMethod: "PUT",
    isBase64Encoded: false,
    path: "",
    pathParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    resource: "",
  });

  console.log(response);
})();
