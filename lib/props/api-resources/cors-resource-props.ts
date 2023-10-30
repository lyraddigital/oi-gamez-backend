import { IResource } from "aws-cdk-lib/aws-apigateway";

import { CorsProps } from "../cors-props";

export interface CorsResourceProps extends CorsProps {
  parentResource: IResource;
  resourceName: string;
  allowedHeaders?: string;
}
