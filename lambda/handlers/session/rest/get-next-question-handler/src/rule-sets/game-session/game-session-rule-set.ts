import { GameSessionStatuses } from "@oigamez/dynamodb";
import { GameSession } from "@oigamez/models";
import { RuleSetResult } from "@oigamez/rule-sets";

export const runGameSessionRuleResult = (
  gameSession?: GameSession
): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Could not find the game session that matches the passed in session id.",
      ],
    };
  } else if (gameSession.status != GameSessionStatuses.inProgress) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot get next question. The game session is not in progress.",
      ],
    };
  } else if (gameSession.isAllowingSubmissions) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot get next question. The current question has not closed off submissions.",
      ],
    };
  } else {
    const currentQuestionNumber = gameSession.currentQuestionNumber;
    const questions = gameSession.questions;

    if (questions?.length === 0 || !currentQuestionNumber) {
      return {
        isSuccessful: false,
        errorMessages: [
          "Cannot get next question. Question data could not be found.",
        ],
      };
    } else {
      const questionsLength = gameSession.questions.length;

      if (currentQuestionNumber == questionsLength) {
        return {
          isSuccessful: false,
          errorMessages: [
            "Cannot get next question. This was the last question.",
          ],
        };
      }
    }
  }

  return { isSuccessful: true, errorMessages: [] };
};
