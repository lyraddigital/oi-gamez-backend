import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

import { JobHandlerFunctionProps } from "../props";

export class JobHandlerFunction extends Construct {
  public lambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: JobHandlerFunctionProps) {
    super(scope, id);

    this.lambdaFunction = new NodejsFunction(this, "LambdaFunction", {
      runtime: Runtime.NODEJS_18_X,
      handler: `${props.handlerFunctionName}`,
      entry: join(__dirname, props.handlerFileLocation),
      environment: props.environment,
      bundling: {
        format: OutputFormat.ESM,
      },
    });
  }
}
