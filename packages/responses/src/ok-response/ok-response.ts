import { APIGatewayProxyResult } from "aws-lambda";

export const okResponse = (): APIGatewayProxyResult => {
  return { statusCode: 200, body: undefined };
};
