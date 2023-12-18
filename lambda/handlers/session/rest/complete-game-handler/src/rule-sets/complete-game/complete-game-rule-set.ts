import { GameSessionStatuses } from "@oigamez/dynamodb";
import { GameSession } from "@oigamez/models";
import { RuleSetResult } from "@oigamez/rule-sets";

export const runCompleteGameRuleSet = (
  gameSession?: GameSession
): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot complete game. No game was found."],
    };
  } else if (gameSession.status !== GameSessionStatuses.completed) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot complete game. The game was not set to complete.",
      ],
    };
  }

  return {
    isSuccessful: true,
    errorMessages: [],
  };
};
