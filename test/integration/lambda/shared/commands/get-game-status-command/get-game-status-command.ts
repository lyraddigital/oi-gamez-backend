import {
  PLAYER_REST_API_BASE_URL,
  PLAYER_REST_API_ORIGIN,
} from "../../environment";
import { RestCommand } from "../rest-command";
import { GameSessionStatus } from "./game-session-status";

export class GetGameStatusCommand extends RestCommand {
  constructor() {
    super(PLAYER_REST_API_BASE_URL);
  }

  public async execute(gameCode?: string): Promise<GameSessionStatus> {
    return await this.getFromCorsEndpoint<GameSessionStatus>(
      `games/${gameCode}/status`,
      PLAYER_REST_API_ORIGIN
    );
  }
}
