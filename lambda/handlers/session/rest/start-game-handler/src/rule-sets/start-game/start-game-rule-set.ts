import { GameSessionStatuses } from "@oigamez/dynamodb";
import { GameSession } from "@oigamez/models";
import { RuleSetResult } from "@oigamez/rule-sets";

export const runStartGameRuleSet = (
  gameSession?: GameSession
): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot start game. No game was found."],
    };
  } else if (gameSession.status === GameSessionStatuses.inProgress) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot start game. The game has already started."],
    };
  } else if (gameSession.status === GameSessionStatuses.completed) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot start game. The game is over."],
    };
  } else if (gameSession.currentNumberOfPlayers < gameSession.minPlayers) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot start game. Not enough players have joined."],
    };
  }

  return { isSuccessful: true, errorMessages: [] };
};
