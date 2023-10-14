import { gameSessionStatuses } from "@oigamez/dynamodb";

const runPlayerRuleSet = (player) => {
  if (!player) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot disconnect from game. No player was found."],
    };
  }

  return { isSuccessful: true };
};

const runGameSessionRuleResult = (gameSession) => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot disconnect from game. The game linked to the player was not found.",
      ],
    };
  } else if (gameSession.status === gameSessionStatuses.notActive) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot disconnect from game. The game linked to the player was not found.",
      ],
    };
  }

  return { isSuccessful: true };
};

export const runDisconnectFromGameSessionRuleSet = (player, gameSession) => {
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
