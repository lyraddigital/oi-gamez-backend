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
    const playerSessionId = event?.queryStringParameters
      ? event.queryStringParameters["sessionId"]
      : undefined;
    const connectionId = event.requestContext.connectionId;
    const epochTime = event.requestContext.requestTimeEpoch;
    const validationResult = validateSessionId(playerSessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const player = await getPlayerBySessionId(playerSessionId!, ttl);
    const gameSession = await getGameSession(player?.hostSessionId || "", ttl);
    const ruleResult = runConnectToGameSessionRuleSet(player, gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    await updatePlayerAndGameSession({
      playerSessionId: playerSessionId!,
      hostSessionId: gameSession!.sessionId,
      connectionId: connectionId!,
      gameSessionTTL: gameSession!.ttl,
    });

    const hasPreviouslyConnected = !!player!.connectionId;
    const canStartGame =
      gameSession!.minPlayers <= gameSession!.currentNumberOfPlayers + 1;

    // If the player has already connected previously we don't need to
    // notify the game host again. So only do this if this is a first
    // time connection
    if (!hasPreviouslyConnected) {
      await sendCommunicationEvent(
        GAME_SESSION_WEBSOCKET_ENDPOINT,
        gameSession!.connectionId!,
        "playerJoined",
        {
          username: player!.username,
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
