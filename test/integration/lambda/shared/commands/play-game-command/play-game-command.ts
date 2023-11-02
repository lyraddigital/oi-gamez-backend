import { RestCommand } from "../rest-command";

import { PlayGameCommandResponse } from "./play-game-command-response";

export class PlayGameCommand extends RestCommand {
  constructor() {
    super("https://cwrj9c1y1i.execute-api.ap-southeast-2.amazonaws.com/prod");
  }

  public async execute(): Promise<PlayGameCommandResponse> {
    return await this.postToEndpoint("games");
  }
}
