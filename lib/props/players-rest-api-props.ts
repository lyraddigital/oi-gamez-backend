import { WebSocketApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

export interface PlayersRestApiProps {
  table: TableV2;
  gameSessionSocketApi: WebSocketApi;
  account: string;
  region: string;
}
