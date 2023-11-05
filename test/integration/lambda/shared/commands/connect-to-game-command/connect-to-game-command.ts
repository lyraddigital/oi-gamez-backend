import { PLAYER_WEBSOCKET_API_BASE_URL } from "../../environment";

import { WebSocketCommand } from "../web-socket-command";

export class ConnectToGameCommand extends WebSocketCommand {
  constructor() {
    super(PLAYER_WEBSOCKET_API_BASE_URL);
  }
}
