import { CONNECT_WINDOW_IN_SECONDS } from "@oigamez/configuration";
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

import { validateEnvironment } from "./configuration/index.js";
import { createPlayer } from "./repositories/index.js";
import { runJoinGameRuleSet } from "./rule-sets/index.js";
import { validateRequest } from "./validators/index.js";

validateEnvironment();

export const handler = async (event) => {
  try {
    const origin = event?.headers ? event.headers["origin"] : undefined;
    const gameCode = event?.pathParameters
      ? event.pathParameters["code"]
      : undefined;
    const epochTime = event.requestContext.requestTimeEpoch;
    let username;

    try {
      const payload = JSON.parse(event.body);
      username = payload.username;
    } catch {
      username = null;
    }

    const validationResult = validateRequest(origin, gameCode, username);

    if (!validationResult.isSuccessful) {
      return corsBadRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const gameSession = await getGameSessionByCode(gameCode, ttl);
    const existingPlayers = await getPlayersInGameSession(gameSession, ttl);
    const ruleResult = runJoinGameRuleSet(
      gameSession,
      username,
      existingPlayers
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
      gameSession.sessionId,
      playerSessionId,
      username,
      playerTTL
    );

    return corsOkResponseWithData({});
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to check the status of a game code."
    );
  }
};

(async () => {
  const response = await handler({
    headers: { origin: "https://oigamez.com" },
    pathParameters: { code: "OTEK" },
    requestContext: {
      requestTimeEpoch: Date.now(),
    },
    body: JSON.stringify({ username: "daryl_duck" }),
  });

  console.log(response);
})();
