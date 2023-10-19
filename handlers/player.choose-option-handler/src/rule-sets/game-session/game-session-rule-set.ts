import { GameSession } from "@oigamez/repositories";
import { RuleSetResult } from "@oigamez/rule-sets";

export const runGameSessionRuleSet = (
  gameSession: GameSession
): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot choose option for the current question. Could not determine the game that the choice was for.",
      ],
    };
  } else if (!gameSession.isAllowingSubmissions) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot choose option for the current question. Could not determine the game that the choice was for.",
      ],
    };
  }

  return { isSuccessful: true };
};
