import { GameSessionStatuses } from "@oigamez/dynamodb";
import { getGameSessionByCode } from "@oigamez/repositories";

import { GameSessionStatus } from "../../models";

export const getGameStatus = async (
  code: string,
  ttl: number
): Promise<GameSessionStatus> => {
  const gameSession = await getGameSessionByCode(code, ttl);
  let canJoinGameSession = false;
  let reason = "Not Found";

  if (gameSession) {
    const hasGameNotStarted =
      gameSession.status == GameSessionStatuses.notStarted;
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
