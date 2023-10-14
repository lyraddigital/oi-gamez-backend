import { PLAYER_WEBSOCKET_ENDPOINT } from "./player-websocket-endpoint.js";

export const verifyPlayerWebsocketEndpoint = () => {
  if (!PLAYER_WEBSOCKET_ENDPOINT) {
    throw new Error(
      "PLAYER_WEBSOCKET_ENDPOINT environment variable is not set"
    );
  }
};
