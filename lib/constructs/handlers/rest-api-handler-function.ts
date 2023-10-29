import { Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

import { RestAPIHandlerFunctionProps } from "../../props";

export class RestAPIHandlerFunction extends Construct {
  public lambdaFunction: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    props: RestAPIHandlerFunctionProps
  ) {
    super(scope, id);

    this.lambdaFunction = new NodejsFunction(this, "LambdaFunction", {
      runtime: Runtime.NODEJS_18_X,
      handler: `${props.handlerFunctionName}`,
      entry: join(__dirname, props.handlerFileLocation),
      environment: props.environment,
    });

    props.resource.addMethod(
      props.method,
      new LambdaIntegration(this.lambdaFunction)
    );
  }
}
