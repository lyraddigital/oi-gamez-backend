export interface GameSession {
  sessionId: string;
  status: string;
  currentNumberOfPlayers: number;
  connectionId: string;
  gameCode: string;
  minPlayers: number;
  maxPlayers: number;
  ttl: number;
}
