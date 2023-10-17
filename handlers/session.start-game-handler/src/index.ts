import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PLAYER_WEBSOCKET_ENDPOINT } from "@oigamez/configuration";
import { sendCommunicationEvent } from "@oigamez/communication";
import { getGameSession, getPlayersInGameSession } from "@oigamez/repositories";
import {
  okResponseWithData,
  fatalErrorResponse,
  badRequestResponse,
} from "@oigamez/responses";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";
import { validateSessionId } from "@oigamez/validators";

import { validateEnvironment } from "./configuration/index.js";
import {
  getQuestionGroupByNumber,
  getQuestionGroupCount,
  updateGameWithQuestionGroupDetails,
} from "./repositories/index.js";
import { runStartGameRuleSet } from "./rule-sets/index.js";
import {
  getFirstQuestionAndCountFromDynamo,
  mapToCommunicationQuestion,
} from "./services/index.js";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const sessionId = event.headers
      ? event.headers["api-session-id"]
      : undefined;
    const epochTime = event.requestContext.requestTimeEpoch;
    const validationResult = validateSessionId(sessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const gameSession = await getGameSession(sessionId, ttl);
    const ruleResult = runStartGameRuleSet(gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    const { questionGroupCount } = await getQuestionGroupCount();
    const randomQuestionGroupNumber = Math.ceil(
      Math.random() * questionGroupCount
    );
    const questionGroupDynamo = await getQuestionGroupByNumber(
      randomQuestionGroupNumber
    );

    await updateGameWithQuestionGroupDetails({
      sessionId,
      questions: questionGroupDynamo.Questions,
      answers: questionGroupDynamo.Answers,
    });

    const [firstQuestion, count] = getFirstQuestionAndCountFromDynamo(
      questionGroupDynamo.Questions
    );

    const communicationQuestion = mapToCommunicationQuestion(firstQuestion);
    const players = await getPlayersInGameSession(gameSession, ttl);
    const communicationPromises = players.map((player) =>
      sendCommunicationEvent(
        PLAYER_WEBSOCKET_ENDPOINT,
        player.connectionId,
        "gameStarted",
        {
          question: communicationQuestion,
          currentQuestionNumber: 1,
          totalNumberOfQuestions: count,
        }
      )
    );

    await Promise.all(communicationPromises);

    return okResponseWithData({
      currentQuestionNumber: 1,
      question: firstQuestion,
      totalNumberOfQuestions: count,
    });
  } catch (e) {
    console.log(e);

    return fatalErrorResponse("Unknown issue while trying to start the game.");
  }
};

(async () => {
  const event: APIGatewayProxyEvent = {
    headers: {
      ["api-session-id"]: "c577639cbde246ef97e7b796fd28fa40",
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
