import { badRequestResponse } from "@oigamez/responses";
import { getGameSession, getPlayerBySessionId } from "@oigamez/repositories";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";
import { validateSessionId } from "@oigamez/validators";

import { validateEnvironment } from "./configuration/index.js";
import { runConnectToGameSessionRuleSet } from "./rule-sets/index.js";

validateEnvironment();

export const handler = async (event) => {
  try {
    const playerSessionId = event.queryStringParameters["sessionId"];
    const connectionId = event.requestContext.connectionId;
    const epochTime = event.requestContext.requestTimeEpoch;
    const validationResult = validateSessionId(playerSessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const player = await getPlayerBySessionId(playerSessionId, ttl);
    const gameSession = await getGameSession(player?.hostSessionId, ttl);
    const ruleResult = runConnectToGameSessionRuleSet(player, gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    // const playerSessionId = createUniqueSessionId();
    // const playerTTL = incrementAndReturnInSeconds(
    //   epochTime,
    //   CONNECT_WINDOW_IN_SECONDS
    // );
    // await createPlayer(
    //   gameSession.sessionId,
    //   playerSessionId,
    //   username,
    //   playerTTL
    // );
    // return corsOkResponseWithData({ sessionId: playerSessionId });
  } catch (e) {
    console.log(e);

    // return fatalErrorResponse(
    //   "Unknown issue while trying to check the status of a game code."
    // );
  }
};

(async () => {
  const response = await handler({
    queryStringParameters: { sessionId: "cf1a5e092ec441e8a98674e09e9ca423" },
    requestContext: {
      requestTimeEpoch: Date.now(),
    },
  });

  console.log(response);
})();
