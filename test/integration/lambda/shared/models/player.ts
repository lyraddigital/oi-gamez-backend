export interface Player {
  hostSessionId: string;
  sessionId: string;
  connectionId?: string;
  username: string;
  choices: Map<number, string>;
  ttl: number;
}
