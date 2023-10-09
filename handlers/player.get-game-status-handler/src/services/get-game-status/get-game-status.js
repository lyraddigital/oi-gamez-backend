import { gameSessionStatuses } from "@oigamez/dynamodb";
import { getGameSessionByCode } from "@oigamez/repositories";

export const getGameStatus = async (code, ttl) => {
  const gameSession = await getGameSessionByCode(code, ttl);
  let canJoinGameSession = false;
  let reason = "Not Found";

  if (gameSession) {
    const hasGameNotStarted =
      gameSession.status == gameSessionStatuses.notStarted;
    const isGameFull =
      gameSession.currentNumberOfPlayers >= gameSession.maxPlayers;

    canJoinGameSession = hasGameNotStarted && !isGameFull;
    reason = isGameFull
      ? "Room is full"
      : hasGameNotStarted
      ? ""
      : gameSession.status || "";
  }

  return { canJoin: canJoinGameSession, reason };
};
