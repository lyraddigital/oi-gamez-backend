import { RestCommand } from "../rest-command";

import {
  PLAYER_REST_API_BASE_URL,
  PLAYER_REST_API_ORIGIN,
} from "../../environment";
import { ChooseOptionCommandResponse } from "./choose-option-command-response";
import { ChooseOptionCommandRequest } from "./choose-option-command-request";

export class ChooseOptionCommand extends RestCommand {
  constructor() {
    super(PLAYER_REST_API_BASE_URL);
  }

  public async execute(
    sessionId: string | undefined,
    request: ChooseOptionCommandRequest
  ): Promise<ChooseOptionCommandResponse> {
    return await this.patchToCorsEndpoint(
      `choices`,
      PLAYER_REST_API_ORIGIN,
      request,
      { "api-session-id": sessionId }
    );
  }
}
