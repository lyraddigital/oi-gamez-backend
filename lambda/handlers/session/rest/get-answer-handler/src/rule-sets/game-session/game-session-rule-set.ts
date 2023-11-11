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
  } else if (gameSession.status !== GameSessionStatuses.inProgress) {
    return {
      isSuccessful: false,
      errorMessages: ["Could not get the answer. The game is not in progress"],
    };
  } else if (gameSession.currentQuestionNumber === undefined) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Could not get the answer. As we could not find the question number in order to get the answer",
      ],
    };
  }

  return { isSuccessful: true, errorMessages: [] };
};
