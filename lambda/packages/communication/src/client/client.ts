import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";

let client: ApiGatewayManagementApiClient;

export const getClient = (endpoint: string): ApiGatewayManagementApiClient => {
  if (!client) {
    client = new ApiGatewayManagementApiClient({
      endpoint: endpoint,
      region: "ap-southeast-2",
    });
  }

  return client;
};
