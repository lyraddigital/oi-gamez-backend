import { APIGatewayProxyResult } from "aws-lambda";
import { CORS_ALLOWED_ORIGINS } from "@oigamez/configuration/cors-allowed-origin";

export const corsBadRequestResponse = (
  errorMessages: string[]
): APIGatewayProxyResult => {
  return {
    statusCode: 400,
    headers: {
      "access-control-allow-origin": CORS_ALLOWED_ORIGINS,
      "content-type": "application/json",
    },
    body: JSON.stringify({ errorMessages }),
  };
};
