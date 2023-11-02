import { RestCommand } from "../rest-command";

import { GAME_SESSION_REST_API_BASE_URL } from "../../environment";
import { PlayGameCommandResponse } from "./play-game-command-response";

export class PlayGameCommand extends RestCommand {
  constructor() {
    super(GAME_SESSION_REST_API_BASE_URL);
  }

  public async execute(): Promise<PlayGameCommandResponse> {
    return await this.postToEndpoint("games");
  }
}
