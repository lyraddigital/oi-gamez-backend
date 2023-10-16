import { GameSessionStatuses } from "@oigamez/dynamodb";
import { GameSession } from "@oigamez/repositories";
import { RuleSetResult } from "@oigamez/rule-sets";

export const runGameSessionRuleSet = (
  gameSession: GameSession
): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Can't find the game session for the passed in game code.",
      ],
    };
  }

  const hasGameNotStarted =
    gameSession.status == GameSessionStatuses.notStarted;
  const isGameFull =
    gameSession.currentNumberOfPlayers >= gameSession.maxPlayers;

  if (!hasGameNotStarted) {
    return {
      isSuccessful: false,
      errorMessages: [
        `Can't join game. The game is not in a "Not Started" status`,
      ],
    };
  }

  if (isGameFull) {
    return {
      isSuccessful: false,
      errorMessages: [`Can't join game. The game is full`],
    };
  }

  return { isSuccessful: true };
};
