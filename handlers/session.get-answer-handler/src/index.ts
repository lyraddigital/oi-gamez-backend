import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PLAYER_WEBSOCKET_ENDPOINT } from "@oigamez/configuration";
import { sendCommunicationEvent } from "@oigamez/communication";
import { Player } from "@oigamez/models";
import {
  badRequestResponse,
  okResponseWithData,
  fatalErrorResponse,
} from "@oigamez/responses";
import { getGameSession, getPlayersInGameSession } from "@oigamez/repositories";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";
import { validateSessionId } from "@oigamez/validators";

import { validateEnvironment } from "./configuration";
import { disallowSubmissions } from "./repositories";
import { runGameSessionRuleResult } from "./rule-sets";
import { getQuestionDetailsFromGameSession } from "./services";

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
    const gameSession = await getGameSession(sessionId, ttl);
    const ruleResult = runGameSessionRuleResult(gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    await disallowSubmissions(sessionId);

    const [currentQuestionNumber, answer] =
      getQuestionDetailsFromGameSession(gameSession);

    const players = await getPlayersInGameSession(gameSession, ttl);

    const communicationPromises = players.map((p: Player) => {
      const playerChoice = p.choices?.get(currentQuestionNumber);
      const hasCorrectAnswer = playerChoice === answer;

      sendCommunicationEvent(
        PLAYER_WEBSOCKET_ENDPOINT,
        p.connectionId,
        "confirmAnswer",
        {
          hasCorrectAnswer,
          answer,
        }
      );
    });

    await Promise.all(communicationPromises);

    return okResponseWithData({ answer });
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to get answer for a game."
    );
  }
};

(async () => {
  const event: APIGatewayProxyEvent = {
    headers: {
      ["api-session-id"]: "d36c371fa1874eeab9d49b513f1319e2",
    },
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
    body: "",
    multiValueHeaders: {},
    httpMethod: "PUT",
    isBase64Encoded: false,
    path: "",
    pathParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    resource: "",
  };

  const response = await handler(event);

  console.log(response);
})();
