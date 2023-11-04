import { GAME_SESSION_WEBSOCKET_API_BASE_URL } from "../../environment";

import { WebSocketCommand } from "../web-socket-command";

export class ConnectGameCommand extends WebSocketCommand {
  constructor() {
    super(GAME_SESSION_WEBSOCKET_API_BASE_URL);
  }
}
