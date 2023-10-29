import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CONNECT_WINDOW_IN_SECONDS } from "@oigamez/configuration";
import { Player } from "@oigamez/models";
import {
  getGameSessionByCode,
  getPlayersInGameSession,
} from "@oigamez/repositories";
import {
  corsBadRequestResponse,
  corsOkResponseWithData,
  fatalErrorResponse,
} from "@oigamez/responses";
import {
  convertFromMillisecondsToSeconds,
  incrementAndReturnInSeconds,
  createUniqueSessionId,
} from "@oigamez/services";

import { validateEnvironment } from "./configuration";
import { JoinGamePayload } from "./models";
import { createPlayer } from "./repositories";
import { runJoinGameRuleSet } from "./rule-sets";
import { validateRequest } from "./validators";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const origin = event?.headers ? event.headers["origin"] : undefined;
    const gameCode = event?.pathParameters
      ? event.pathParameters["code"]
      : undefined;
    const epochTime = event.requestContext.requestTimeEpoch;
    let username: string | undefined;

    try {
      if (event.body) {
        const payload = JSON.parse(event.body) as JoinGamePayload;
        username = payload.username;
      }
    } catch {}

    const validationResult = validateRequest(origin, gameCode, username);

    if (!validationResult.isSuccessful) {
      return corsBadRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const gameSession = await getGameSessionByCode(gameCode!, ttl);
    const existingPlayers = await getPlayersInGameSession(gameSession!, ttl);
    const existingUsernames = existingPlayers.map((p: Player) => p.username);
    const ruleResult = runJoinGameRuleSet(
      gameSession,
      username!,
      existingUsernames
    );

    if (!ruleResult.isSuccessful) {
      return corsBadRequestResponse(ruleResult.errorMessages);
    }

    const playerSessionId = createUniqueSessionId();
    const playerTTL = incrementAndReturnInSeconds(
      epochTime,
      CONNECT_WINDOW_IN_SECONDS
    );

    await createPlayer(
      gameSession!.sessionId,
      playerSessionId,
      username!,
      playerTTL
    );

    return corsOkResponseWithData({ sessionId: playerSessionId });
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to check the status of a game code."
    );
  }
};
