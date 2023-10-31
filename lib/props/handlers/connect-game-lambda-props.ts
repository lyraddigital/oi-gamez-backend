import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

export interface ConnectGameLambdaProps {
  table: TableV2;
}
