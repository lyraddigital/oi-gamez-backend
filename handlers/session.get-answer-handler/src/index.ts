import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  badRequestResponse,
  okResponseWithData,
  fatalErrorResponse,
} from "@oigamez/responses";
import { validateSessionId } from "@oigamez/validators";

import { validateEnvironment } from "./configuration";
import { disallowSubmissions } from "./repositories";

validateEnvironment();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const sessionId = event.headers["api-session-id"];
    const validationResult = validateSessionId(sessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    await disallowSubmissions(sessionId);

    return okResponseWithData(event);
  } catch (e) {
    console.log(e);

    return fatalErrorResponse("Unknown issue while trying to start the game.");
  }
};

(async () => {
  const event: APIGatewayProxyEvent = {
    headers: {
      ["api-session-id"]: "1f3918fb37ac4ef296ab72fc694e4ecf",
    },
    queryStringParameters: {},
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
      protocol: "websocket",
      stage: "local",
      requestTimeEpoch: Date.now(),
      connectionId: "3940329432049",
    },
    body: "",
    multiValueHeaders: {},
    httpMethod: "PUT",
    isBase64Encoded: false,
    path: "",
    pathParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    resource: "",
  };

  const response = await handler(event);

  console.log(response);
})();
