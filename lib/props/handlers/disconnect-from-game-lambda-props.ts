import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

import { WebsocketApiConnectionEndpointProps } from "./websocket-api-connection-endpoint";

export interface DisconnectFromGameLambdaProps
  extends WebsocketApiConnectionEndpointProps {
  table: TableV2;
}
