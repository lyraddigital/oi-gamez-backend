import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getGameSession, getPlayerBySessionId } from "@oigamez/repositories";
import {
  corsBadRequestResponse,
  corsOkResponse,
  fatalErrorResponse,
} from "@oigamez/responses";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";

import { validateEnvironment } from "./configuration";
import { ChooseOptionRequestPayload } from "./models";
import { runGameSessionRuleSet, runPlayerRuleSet } from "./rule-sets";
import { validateRequest } from "./validators";
import { updatePlayerChoices } from "./repositories";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const origin = event.headers["origin"];
    const sessionId = event.headers["api-session-id"];
    const epochTime = event.requestContext.requestTimeEpoch;
    let optionId: string | undefined;

    try {
      if (event.body) {
        const payload = JSON.parse(event.body) as ChooseOptionRequestPayload;
        optionId = payload.optionId;
      }
    } catch {}

    const requestValidationResult = validateRequest(
      origin,
      sessionId,
      optionId
    );

    if (!requestValidationResult.isSuccessful) {
      return corsBadRequestResponse(requestValidationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const player = await getPlayerBySessionId(sessionId!, ttl);
    const playerRuleSet = runPlayerRuleSet(player);

    if (!playerRuleSet.isSuccessful) {
      return corsBadRequestResponse(playerRuleSet.errorMessages);
    }

    const gameSession = await getGameSession(player!.hostSessionId, ttl);
    const gameSessionRuleSet = runGameSessionRuleSet(gameSession);

    if (!gameSessionRuleSet.isSuccessful) {
      return corsBadRequestResponse(gameSessionRuleSet.errorMessages);
    }

    player!.choices = player!.choices || new Map<number, string>();
    player!.choices.set(gameSession!.currentQuestionNumber!, optionId!);

    await updatePlayerChoices(
      player!.sessionId,
      player!.hostSessionId,
      player!.choices
    );

    return corsOkResponse();
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to check the status of a game code."
    );
  }
};
