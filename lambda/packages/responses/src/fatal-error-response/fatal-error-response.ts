import { APIGatewayProxyResult } from "aws-lambda";

export const fatalErrorResponse = (error: string): APIGatewayProxyResult => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      errorMessages: [error],
    }),
  };
};
