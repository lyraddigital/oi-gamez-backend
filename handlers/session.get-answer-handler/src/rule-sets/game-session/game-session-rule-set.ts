import { GameSession } from "@oigamez/repositories";
import { RuleSetResult } from "@oigamez/rule-sets";

export const runGameSessionRuleResult = (
  gameSession?: GameSession
): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: true,
      errorMessages: [
        "Could not find the game session that matches the passed in session id.",
      ],
    };
  }

  return { isSuccessful: true };
};
