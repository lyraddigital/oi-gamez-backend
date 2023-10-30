import { APIGatewayProxyResult } from "aws-lambda";
import { CORS_ALLOWED_ORIGINS } from "@oigamez/configuration/cors-allowed-origin";

export const corsOkResponse = (): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    headers: {
      "access-control-allow-origin": CORS_ALLOWED_ORIGINS,
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  };
};
