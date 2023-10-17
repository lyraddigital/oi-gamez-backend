import { PLAYER_WEBSOCKET_ENDPOINT } from "./player-websocket-endpoint";

export const verifyPlayerWebsocketEndpoint = (): void => {
  if (!PLAYER_WEBSOCKET_ENDPOINT) {
    throw new Error(
      "PLAYER_WEBSOCKET_ENDPOINT environment variable is not set"
    );
  }
};
