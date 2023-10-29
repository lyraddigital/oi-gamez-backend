import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

export interface GameSessionRestApiProps {
  table: TableV2;
  account: string;
  region: string;
}
