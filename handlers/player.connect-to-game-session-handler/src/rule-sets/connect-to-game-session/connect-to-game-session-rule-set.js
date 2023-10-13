import { gameSessionStatuses } from "@oigamez/dynamodb";

const runPlayerRuleSet = (player) => {
  if (!player) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot connect to game. No player was found."],
    };
  }

  return { isSuccessful: true };
};

const runGameSessionRuleResult = (gameSession) => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot connect to game. The game linked to the player was not found.",
      ],
    };
  } else if (gameSession.status === gameSessionStatuses.notActive) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot connect to game. No game was found."],
    };
  } else if (gameSession.status === gameSessionStatuses.completed) {
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

export const runConnectToGameSessionRuleSet = (player, gameSession) => {
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
