import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";
import { GAME_SESSION_WEBSOCKET_ENDPOINT } from "@oigamez/configuration";

export const client = new ApiGatewayManagementApiClient({
  endpoint: GAME_SESSION_WEBSOCKET_ENDPOINT,
  region: "ap-southeast-2",
});
