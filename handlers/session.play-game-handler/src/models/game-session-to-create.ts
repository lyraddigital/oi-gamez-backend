export interface GameSessionToCreate {
  sessionId: string;
  gameCode: string;
  maxPlayers: number;
  minPlayers: number;
  ttl: number;
}
