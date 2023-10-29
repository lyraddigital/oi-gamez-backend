import { GameSessionStatuses } from "@oigamez/dynamodb";
import { GameSession, Player } from "@oigamez/models";
import { RuleSetResult } from "@oigamez/rule-sets";

const runPlayerRuleSet = (player?: Player): RuleSetResult => {
  if (!player) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot disconnect from game. No player was found."],
    };
  }

  return { isSuccessful: true, errorMessages: [] };
};

const runGameSessionRuleResult = (gameSession?: GameSession): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot disconnect from game. The game linked to the player was not found.",
      ],
    };
  } else if (gameSession.status === GameSessionStatuses.notActive) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot disconnect from game. The game linked to the player was not found.",
      ],
    };
  }

  return { isSuccessful: true, errorMessages: [] };
};

export const runDisconnectFromGameSessionRuleSet = (
  player?: Player,
  gameSession?: GameSession
): RuleSetResult => {
  const playerRuleResult = runPlayerRuleSet(player);
  const gameSessionRuleResult = runGameSessionRuleResult(gameSession);

  if (!playerRuleResult.isSuccessful) {
    return playerRuleResult;
  }

  if (!gameSessionRuleResult.isSuccessful) {
    return gameSessionRuleResult;
  }

  return { isSuccessful: true, errorMessages: [] };
};
