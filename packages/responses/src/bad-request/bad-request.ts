import { APIGatewayProxyResult } from "aws-lambda";

export const badRequestResponse = (
  errorMessages: string[]
): APIGatewayProxyResult => {
  return {
    statusCode: 400,
    body: JSON.stringify({ errorMessages }),
  };
};
