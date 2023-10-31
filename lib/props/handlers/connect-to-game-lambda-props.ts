import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

import { WebsocketApiConnectionEndpointProps } from "./websocket-api-connection-endpoint";

export interface ConnectToGameLambdaProps
  extends WebsocketApiConnectionEndpointProps {
  table: TableV2;
}
