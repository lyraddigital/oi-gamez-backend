import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { incrementAndReturnInSeconds } from "@oigamez/services/increment-and-convert-to-seconds";
import { convertFromMillisecondsToSeconds } from "@oigamez/services/milliseconds-to-seconds";
import { GameSessionStatuses } from "@oigamez/dynamodb";
import { getGameSession } from "@oigamez/repositories";
import { badRequestResponse } from "@oigamez/responses/bad-request";
import { okResponse } from "@oigamez/responses/ok-response";
import { fatalErrorResponse } from "@oigamez/responses/fatal-error-response";
import { validateSessionId } from "@oigamez/validators";

import {
  UPDATED_CONNECT_WINDOW_IN_SECONDS,
  validateEnvironment,
} from "./configuration";
import { UpdatedGameSession } from "./models";
import { updateGameSessionWithConnectionDetails } from "./repositories";
import { runGameSessionRuleSet } from "./rule-sets";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const sessionId = event.queryStringParameters
      ? event.queryStringParameters["sessionId"]
      : undefined;
    const connectionId = event.requestContext.connectionId;
    const epochTime = event.requestContext.requestTimeEpoch;
    const validationResult = validateSessionId(sessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const gameSession = await getGameSession(sessionId!, ttl);
    const ruleResult = runGameSessionRuleSet(gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    const updatedTTL = incrementAndReturnInSeconds(
      epochTime,
      UPDATED_CONNECT_WINDOW_IN_SECONDS
    );
    const updatedGameSession: UpdatedGameSession = {
      sessionId: sessionId!,
      status: GameSessionStatuses.notStarted,
      connectionId: connectionId!,
      ttl: updatedTTL,
    };

    await updateGameSessionWithConnectionDetails(updatedGameSession);

    return okResponse();
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to connect to the game session socket server."
    );
  }
};
