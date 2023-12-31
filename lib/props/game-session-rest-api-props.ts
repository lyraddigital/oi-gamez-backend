import { WebSocketApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

export interface GameSessionRestApiProps {
  table: TableV2;
  account: string;
  region: string;
  playerSocketApi: WebSocketApi;
  playerWebSocketStageName: string;
}
