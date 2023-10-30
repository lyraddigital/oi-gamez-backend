import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsBadRequestResponse } from "@oigamez/responses/cors-bad-request";
import { corsOkResponseWithData } from "@oigamez/responses/cors-ok-response-with-data";
import { fatalErrorResponse } from "@oigamez/responses/fatal-error-response";
import { convertFromMillisecondsToSeconds } from "@oigamez/services/milliseconds-to-seconds";

import { validateEnvironment } from "./configuration";
import { getGameStatus } from "./services";
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
    const requestValidationResult = validateRequest(origin, gameCode);
    const ttl = convertFromMillisecondsToSeconds(epochTime);

    if (!requestValidationResult.isSuccessful) {
      return corsBadRequestResponse(requestValidationResult.errorMessages);
    }

    return corsOkResponseWithData(await getGameStatus(gameCode!, ttl));
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to check the status of a game code."
    );
  }
};
