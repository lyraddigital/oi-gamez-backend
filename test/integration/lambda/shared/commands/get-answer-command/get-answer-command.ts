import { GAME_SESSION_REST_API_BASE_URL } from "../../environment";
import { RestCommand } from "../rest-command";
import { GetAnswerResponse } from "./get-answer-response";

export class GetAnswerCommand extends RestCommand {
  constructor() {
    super(GAME_SESSION_REST_API_BASE_URL);
  }

  public async execute(sessionId?: string): Promise<GetAnswerResponse> {
    return this.getFromEndpoint("games/answers", {
      "api-session-id": sessionId,
    });
  }
}
