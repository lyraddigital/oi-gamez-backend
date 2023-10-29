import { GAME_SESSION_WEBSOCKET_ENDPOINT } from "./game-session-websocket-endpoint";

export const verifyGameSessionWebsocketEndpoint = (): void => {
  if (!GAME_SESSION_WEBSOCKET_ENDPOINT) {
    throw new Error(
      "GAME_SESSION_WEBSOCKET_ENDPOINT environment variable is not set"
    );
  }
};
