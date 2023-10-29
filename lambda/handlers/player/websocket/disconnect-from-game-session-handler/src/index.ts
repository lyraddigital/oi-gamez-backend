import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GAME_SESSION_WEBSOCKET_ENDPOINT } from "@oigamez/configuration";
import { sendCommunicationEvent } from "@oigamez/communication";
import { GameSessionStatuses } from "@oigamez/dynamodb";
import { getGameSession, getPlayerByConnectionId } from "@oigamez/repositories";
import {
  badRequestResponse,
  fatalErrorResponse,
  okResponse,
} from "@oigamez/responses";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";

import { validateEnvironment } from "./configuration";
import {
  clearPlayerConnection,
  removePlayerAndUpdateGameSession,
} from "./repositories";
import { runDisconnectFromGameSessionRuleSet } from "./rule-sets";
import { validateConnectionId } from "./validators";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const connectionId = event.requestContext.connectionId;
    const epochTime = event.requestContext.requestTimeEpoch;
    const validationResult = validateConnectionId(connectionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const player = await getPlayerByConnectionId(connectionId!, ttl);
    const gameSession = await getGameSession(player?.hostSessionId || "", ttl);
    const ruleResult = runDisconnectFromGameSessionRuleSet(player, gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    if (gameSession!.status === GameSessionStatuses.notStarted) {
      await removePlayerAndUpdateGameSession({
        playerSessionId: player!.sessionId,
        hostSessionId: gameSession!.sessionId,
      });

      const canStartGame =
        gameSession!.minPlayers <= gameSession!.currentNumberOfPlayers - 1;

      await sendCommunicationEvent(
        GAME_SESSION_WEBSOCKET_ENDPOINT,
        gameSession!.connectionId!,
        "playerLeft",
        {
          username: player!.username,
          canStartGame,
        }
      );
    } else {
      await clearPlayerConnection({
        hostSessionId: gameSession!.sessionId,
        playerSessionId: player!.sessionId,
      });
    }

    return okResponse();
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to disconnect from the player socket server."
    );
  }
};
