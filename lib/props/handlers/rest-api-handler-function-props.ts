import { IResource } from "aws-cdk-lib/aws-apigateway";

import { APIHandlerFunctionProps } from "./api-handler-function-props";

export interface RestAPIHandlerFunctionProps extends APIHandlerFunctionProps {
  method: string;
  resource: IResource;
}
