import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  corsBadRequestResponse,
  corsOkResponseWithData,
  fatalErrorResponse,
} from "@oigamez/responses";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";

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

    return corsOkResponseWithData(await getGameStatus(gameCode, ttl));
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to check the status of a game code."
    );
  }
};

(async () => {
  const response = await handler({
    queryStringParameters: {},
    headers: { origin: "https://oigamez.com" },
    pathParameters: { code: "XKPE" },
    body: "",
    requestContext: {
      connectionId: "3940329432049",
      authorizer: null,
      identity: null,
      requestId: "19933884",
      resourceId: "",
      resourcePath: "",
      accountId: "",
      apiId: "api123",
      httpMethod: "PUT",
      path: "/",
      protocol: "websocket",
      stage: "local",
      requestTimeEpoch: Date.now(),
    },
    multiValueHeaders: {},
    httpMethod: "PUT",
    isBase64Encoded: false,
    path: "",
    multiValueQueryStringParameters: null,
    stageVariables: null,
    resource: "",
  });

  console.log(response);
})();
