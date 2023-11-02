import { Question } from "./question";

export interface GameSession {
  sessionId: string;
  status: string;
  currentNumberOfPlayers: number;
  currentQuestionNumber?: number;
  answers: Map<number, string>;
  connectionId?: string;
  gameCode: string;
  isAllowingSubmissions?: boolean;
  minPlayers: number;
  maxPlayers: number;
  ttl: number;
  questions: Question[];
}
