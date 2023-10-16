import { APIGatewayProxyResult } from "aws-lambda";

export const okResponseWithData = <T>(data: T): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
