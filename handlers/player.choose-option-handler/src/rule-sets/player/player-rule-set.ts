import { Player } from "@oigamez/models";
import { RuleSetResult } from "@oigamez/rule-sets";

export const runPlayerRuleSet = (player: Player): RuleSetResult => {
  if (!player) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot choose option for the current question. Could not determine the player who was choosing.",
      ],
    };
  }

  return { isSuccessful: true };
};
