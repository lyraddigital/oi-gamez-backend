export interface GameSession {
  sessionId: string;
  status: string;
  currentNumberOfPlayers: number;
  currentQuestionNumber?: number;
  connectionId: string;
  gameCode: string;
  isAllowingSubmissions?: boolean;
  minPlayers: number;
  maxPlayers: number;
  ttl: number;
}
