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

export const handler = async (event) => {
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
    console.log(players);
    const communicationPromises = players.map((player) =>
      sendCommunicationEvent(player.connectionId, "gameStarted", {
        question: communicationQuestion,
        currentQuestionNumber: 1,
        totalNumberOfQuestions: count,
      })
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
  const event = {
    headers: {
      ["api-session-id"]: "73a31906b8154465a218c79f77843296",
    },
    requestContext: {
      requestTimeEpoch: Date.now(),
    },
  };

  const response = await handler(event);

  console.log(response);
})();
