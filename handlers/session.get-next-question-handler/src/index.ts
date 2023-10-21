import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { sendCommunicationEvent } from "@oigamez/communication";
import { PLAYER_WEBSOCKET_ENDPOINT } from "@oigamez/configuration";
import { mapToCommunicationQuestion } from "@oigamez/mappers";
import {
  badRequestResponse,
  okResponseWithData,
  fatalErrorResponse,
} from "@oigamez/responses";
import { getGameSession, getPlayersInGameSession } from "@oigamez/repositories";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";
import { validateSessionId } from "@oigamez/validators";

import { validateEnvironment } from "./configuration";
import { updateCurrentQuestionAndAllowSubmissions } from "./repositories";
import { runGameSessionRuleResult } from "./rule-sets";

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

    await updateCurrentQuestionAndAllowSubmissions(gameSession.sessionId);

    const currentQuestionNumber = gameSession.currentQuestionNumber + 1;
    const currentQuestionIndex = gameSession.currentQuestionNumber;
    const nextQuestion = gameSession.questions[currentQuestionIndex];
    const nextComQuestion = mapToCommunicationQuestion(nextQuestion);
    const players = await getPlayersInGameSession(gameSession, ttl);
    const communicationPromises = players.map((player) =>
      sendCommunicationEvent(
        PLAYER_WEBSOCKET_ENDPOINT,
        player.connectionId,
        "nextQuestion",
        {
          question: nextComQuestion,
          currentQuestionNumber,
        }
      )
    );

    await Promise.all(communicationPromises);

    return okResponseWithData({
      currentQuestionNumber,
      question: nextQuestion,
    });
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
      ["api-session-id"]: "23a375d40cec4e05b9b8fbf22fd68128",
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
