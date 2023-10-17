import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsBadRequestResponse, fatalErrorResponse } from "@oigamez/responses";
import { convertFromMillisecondsToSeconds } from "@oigamez/services";

import { validateEnvironment } from "./configuration/index.js";
import { ChooseOptionRequestPayload } from "./models/index.js";
import { validateRequest } from "./validators/index.js";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const origin = event.headers["origin"];
    const playerSessionId = event.queryStringParameters["sessionId"];
    const epochTime = event.requestContext.requestTimeEpoch;
    const ttl = convertFromMillisecondsToSeconds(epochTime);
    let optionId: string;

    try {
      const payload = JSON.parse(event.body) as ChooseOptionRequestPayload;
      optionId = payload.optionId;
    } catch {
      optionId = null;
    }

    const requestValidationResult = validateRequest(
      origin,
      playerSessionId,
      optionId
    );

    if (!requestValidationResult.isSuccessful) {
      return corsBadRequestResponse(requestValidationResult.errorMessages);
    }

    // return corsOkResponseWithData(await getGameStatus(gameCode, ttl));
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to check the status of a game code."
    );
  }
};

(async () => {
  const response = await handler({
    queryStringParameters: { sessionId: "393948484" },
    headers: { origin: "https://oigamez.com" },
    pathParameters: {},
    body: JSON.stringify({ optionId: "39384484" }),
    requestContext: {
      authorizer: null,
      identity: null,
      requestId: "19933884",
      resourceId: "",
      resourcePath: "",
      accountId: "",
      apiId: "api123",
      httpMethod: "PUT",
      path: "/",
      protocol: "https",
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
