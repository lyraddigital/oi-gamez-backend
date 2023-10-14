import { gameSessionStatuses } from "@oigamez/dynamodb";

export const runStartGameRuleSet = (gameSession) => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot start game. No game was found."],
    };
  } else if (gameSession.status === gameSessionStatuses.inProgress) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot start game. The game has already started."],
    };
  } else if (gameSession.status === gameSessionStatuses.completed) {
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

  return { isSuccessful: true };
};
