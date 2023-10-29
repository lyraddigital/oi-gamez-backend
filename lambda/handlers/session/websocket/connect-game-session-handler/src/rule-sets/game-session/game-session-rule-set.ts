import { GameSession } from "@oigamez/models";
import { RuleSetResult } from "@oigamez/rule-sets";

export const runGameSessionRuleSet = (
  gameSession?: GameSession
): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot connect to game. No game was found."],
    };
  }

  return { isSuccessful: true, errorMessages: [] };
};
