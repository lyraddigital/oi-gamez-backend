import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PLAYER_WEBSOCKET_ENDPOINT } from "@oigamez/configuration";
import { sendCommunicationEvent } from "@oigamez/communication";
import { getGameSession, getPlayersInGameSession } from "@oigamez/repositories";
import {
  fatalErrorResponse,
  badRequestResponse,
  okResponse,
} from "@oigamez/responses";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";
import { validateSessionId } from "@oigamez/validators";

import { validateEnvironment } from "./configuration";
import { runCompleteGameRuleSet } from "./rule-sets";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const sessionId = event.headers["api-session-id"];
    const epochTime = event.requestContext.requestTimeEpoch;
    const validationResult = validateSessionId(sessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const gameSession = await getGameSession(sessionId!, ttl);
    const ruleResult = runCompleteGameRuleSet(gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    const players = await getPlayersInGameSession(gameSession!, ttl);
    const communicationPromises = players.map((player) =>
      sendCommunicationEvent(
        PLAYER_WEBSOCKET_ENDPOINT,
        player.connectionId!,
        "gameCompleted"
      )
    );

    await Promise.all(communicationPromises);

    return okResponse();
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to complete the game."
    );
  }
};
