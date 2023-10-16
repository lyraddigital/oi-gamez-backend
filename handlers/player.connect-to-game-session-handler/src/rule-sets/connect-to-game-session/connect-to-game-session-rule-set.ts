import { GameSessionStatuses } from "@oigamez/dynamodb";
import { GameSession, Player } from "@oigamez/repositories";
import { RuleSetResult } from "@oigamez/rule-sets";

const runPlayerRuleSet = (player?: Player): RuleSetResult => {
  if (!player) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot connect to game. No player was found."],
    };
  }

  return { isSuccessful: true };
};

const runGameSessionRuleResult = (gameSession?: GameSession): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot connect to game. The game linked to the player was not found.",
      ],
    };
  } else if (gameSession.status === GameSessionStatuses.notActive) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot connect to game. No game was found."],
    };
  } else if (gameSession.status === GameSessionStatuses.completed) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot connect to game. The game is over."],
    };
  } else if (gameSession.currentNumberOfPlayers >= gameSession.maxPlayers) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot connect to game. The game is full."],
    };
  }

  return { isSuccessful: true };
};

export const runConnectToGameSessionRuleSet = (
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

  return { isSuccessful: true };
};
