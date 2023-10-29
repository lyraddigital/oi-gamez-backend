import { APIGatewayProxyResult } from "aws-lambda";

export const okResponse = (): APIGatewayProxyResult => {
  return { statusCode: 200, body: JSON.stringify({}) };
};
