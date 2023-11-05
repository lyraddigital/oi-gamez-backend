import { RestCommand } from "../rest-command";

import {
  PLAYER_REST_API_BASE_URL,
  PLAYER_REST_API_ORIGIN,
} from "../../environment";
import { JoinGameCommandResponse } from "./join-game-command-response";
import { JoinGameCommandRequest } from "./join-game-command-request";

export class JoinGameCommand extends RestCommand {
  constructor() {
    super(PLAYER_REST_API_BASE_URL);
  }

  public async execute(
    gameCode: string,
    request: JoinGameCommandRequest
  ): Promise<JoinGameCommandResponse> {
    return await this.postToCorsEndpoint(
      `games/${gameCode}/players`,
      PLAYER_REST_API_ORIGIN,
      request
    );
  }
}
