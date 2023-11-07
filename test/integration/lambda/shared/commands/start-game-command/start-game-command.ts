import { RestCommand } from "../rest-command";

import { GAME_SESSION_REST_API_BASE_URL } from "../../environment";
import { StartGameCommandResponse } from "./start-game-command-response";

export class StartGameCommand extends RestCommand {
  constructor() {
    super(GAME_SESSION_REST_API_BASE_URL);
  }

  public async execute(sessionId?: string): Promise<StartGameCommandResponse> {
    return await this.patchToEndpoint("games/start", {
      "api-session-id": sessionId,
    });
  }
}
