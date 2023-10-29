import { IResource } from "aws-cdk-lib/aws-apigateway";
import { TableV2 } from "aws-cdk-lib/aws-dynamodb";

export interface LambdaHandlerProps {
  table: TableV2;
  resource: IResource;
}
