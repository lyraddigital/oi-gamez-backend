import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  convertFromMillisecondsToSeconds,
  incrementAndReturnInSeconds,
} from "@oigamez/services";
import { GameSessionStatuses } from "@oigamez/dynamodb";
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
import { UpdatedGameSession } from "./models/index.js";
import { updateGameSessionWithConnectionDetails } from "./repositories/index.js";
import { runGameSessionRuleSet } from "./rule-sets/index.js";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
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
    const updatedGameSession: UpdatedGameSession = {
      sessionId,
      status: GameSessionStatuses.notStarted,
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
  const event: APIGatewayProxyEvent = {
    queryStringParameters: {
      sessionId: "c577639cbde246ef97e7b796fd28fa40",
    },
    headers: {},
    pathParameters: {},
    body: "",
    requestContext: {
      connectionId: "3939384849585",
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
