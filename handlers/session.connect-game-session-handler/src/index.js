import {
  convertFromMillisecondsToSeconds,
  incrementAndReturnInSeconds,
} from "@oigamez/services";
import { gameSessionStatuses } from "@oigamez/dynamodb";
import { getGameSession } from "@oigamez/repositories";
import {
  badRequestResponse,
  fatalErrorResponse,
  okResponse,
} from "@oigamez/responses";
import { validateSessionId } from "@oigamez/validators";

import {
  UPDATED_CONNECT_WINDOW_IN_SECONDS,
  validateEnvironment,
} from "./configuration/index.js";
import { updateGameSessionWithConnectionDetails } from "./repositories/index.js";
import { runGameSessionRuleSet } from "./rule-sets/index.js";

validateEnvironment();

export const handler = async (event) => {
  try {
    const sessionId = event.queryStringParameters["sessionId"];
    const connectionId = event.requestContext.connectionId;
    const epochTime = event.requestContext.requestTimeEpoch;
    const validationResult = validateSessionId(sessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const gameSession = await getGameSession(sessionId, ttl);
    const ruleResult = runGameSessionRuleSet(gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    const updatedTTL = incrementAndReturnInSeconds(
      epochTime,
      UPDATED_CONNECT_WINDOW_IN_SECONDS
    );
    const updatedGameSession = {
      sessionId,
      status: gameSessionStatuses.notStarted,
      connectionId,
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

(async () => {
  const event = {
    queryStringParameters: {
      sessionId: "c18c3a909d334eeb964b0afc32c0863a",
    },
    requestContext: {
      connectionId: "fljewlfwelfewlfj",
      requestTimeEpoch: Date.now(),
    },
  };

  const response = await handler(event);

  console.log(response);
})();
