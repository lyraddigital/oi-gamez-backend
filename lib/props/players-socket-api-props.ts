import { WebSocketApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

export interface PlayersSocketApiProps {
  table: TableV2;
  gameSessionWebSocketApi: WebSocketApi;
  gameSessionWebSocketStageName: string;
  account: string;
  region: string;
}
