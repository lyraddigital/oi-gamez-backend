import {
  convertFromMillisecondsToSeconds,
  incrementAndReturnInSeconds,
} from "@oigamez/services";

import { gameSessionStatuses } from "@oigamez/dynamodb";
import { getGameSession } from "@oigamez/repositories";
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
      return {
        statusCode: 400,
        body: JSON.stringify({
          errorMessages: [validationResult.errorMessage],
        }),
      };
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const gameSession = await getGameSession(sessionId, ttl);
    const ruleResult = runGameSessionRuleSet(gameSession);

    if (!ruleResult.isSuccessful) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errorMessages: ruleResult.errorMessages,
        }),
      };
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

    return { statusCode: 200 };
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
    queryStringParameters: {
      sessionId: "8ab3d82c69224cb4aebd775869520b31",
    },
    requestContext: {
      connectionId: "fljewlfwelfewlfj",
      requestTimeEpoch: Date.now(),
    },
  };

  const response = await handler(event);

  console.log(response);
})();
