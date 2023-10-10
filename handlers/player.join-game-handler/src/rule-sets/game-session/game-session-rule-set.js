import { gameSessionStatuses } from "@oigamez/dynamodb";

export const runGameSessionRuleSet = (gameSession) => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Can't find the game session for the passed in game code.",
      ],
    };
  }

  const hasGameNotStarted =
    gameSession.status == gameSessionStatuses.notStarted;
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
