export interface Player {
  username: string;
  hostSessionId: string;
  connectionId: string;
  sessionId: string;
  choices?: Map<number, string>;
}
