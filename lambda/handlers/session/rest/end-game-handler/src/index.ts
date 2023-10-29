import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PLAYER_WEBSOCKET_ENDPOINT } from "@oigamez/configuration";
import { sendCommunicationEvent } from "@oigamez/communication";
import { getGameSession, getPlayersInGameSession } from "@oigamez/repositories";
import {
  okResponseWithData,
  fatalErrorResponse,
  badRequestResponse,
} from "@oigamez/responses";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";
import { validateSessionId } from "@oigamez/validators";

import { validateEnvironment } from "./configuration";
import { updateGameSessionToComplete } from "./repositories";
import { runEndGameRuleSet } from "./rule-sets";
import { getFinalResult } from "./services";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const sessionId = event.headers["api-session-id"];
    const epochTime = event.requestContext.requestTimeEpoch;
    const validationResult = validateSessionId(sessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    const ttl = convertFromMillisecondsToSeconds(epochTime);
    const gameSession = await getGameSession(sessionId!, ttl);
    const ruleResult = runEndGameRuleSet(gameSession);

    if (!ruleResult.isSuccessful) {
      return badRequestResponse(ruleResult.errorMessages);
    }

    await updateGameSessionToComplete(sessionId!);

    const players = await getPlayersInGameSession(gameSession!, ttl);
    const [leaderboardItems, winners] = getFinalResult(gameSession!, players);
    const communicationPromises = players.map((player) =>
      sendCommunicationEvent(
        PLAYER_WEBSOCKET_ENDPOINT,
        player.connectionId!,
        "gameEnded",
        {
          score:
            leaderboardItems.find((li) => li.username === player.username)
              ?.score || 0,
          position:
            leaderboardItems.find((li) => li.username === player.username)
              ?.position || leaderboardItems.length - 1,
          totalNumberOfQuestions: gameSession!.questions.length,
          hasWon: winners.findIndex((w) => w === player.username) >= 0,
        }
      )
    );

    await Promise.all(communicationPromises);

    return okResponseWithData({
      playerScores: leaderboardItems,
      winners,
    });
  } catch (e) {
    console.log(e);

    return fatalErrorResponse("Unknown issue while trying to start the game.");
  }
};
