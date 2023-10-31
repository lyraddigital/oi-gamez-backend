import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

export interface GameSessionSocketApiProps {
  table: TableV2;
}
