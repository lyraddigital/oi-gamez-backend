import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";

let client;

export const getClient = (endpoint) => {
  if (!client) {
    client = new ApiGatewayManagementApiClient({
      endpoint: endpoint,
      region: "ap-southeast-2",
    });
  }

  return client;
};
