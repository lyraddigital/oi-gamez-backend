import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

export interface GameSessionExpiryLambdaProps {
  table: TableV2;
}
