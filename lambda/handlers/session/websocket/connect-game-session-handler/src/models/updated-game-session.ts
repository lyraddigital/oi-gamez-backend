import { GameSessionStatuses } from "@oigamez/dynamodb";

export interface UpdatedGameSession {
  sessionId: string;
  connectionId: string;
  status: GameSessionStatuses;
  ttl: number;
}
