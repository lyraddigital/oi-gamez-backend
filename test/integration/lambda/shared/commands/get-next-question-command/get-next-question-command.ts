import { GAME_SESSION_REST_API_BASE_URL } from "../../environment";
import { RestCommand } from "../rest-command";
import { GetNextQuestionResponse } from "./get-next-question-response";

export class GetNextQuestionCommand extends RestCommand {
  constructor() {
    super(GAME_SESSION_REST_API_BASE_URL);
  }

  public async execute(sessionId?: string): Promise<GetNextQuestionResponse> {
    return this.getFromEndpoint("games/questions", {
      "api-session-id": sessionId,
    });
  }
}
