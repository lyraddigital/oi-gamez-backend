import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
} from "../../constants";
import { ConnectGameLambdaProps } from "../../props";
import { WebsocketAPIHandlerFunction } from "./websocket-api-handler-function";

export class ConnectGameLambda extends Construct {
  public lambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: ConnectGameLambdaProps) {
    super(scope, id);

    const connectHandlerFunction = new WebsocketAPIHandlerFunction(
      this,
      "ConnectHandlerFunction",
      {
        handlerFileLocation: HandlerFilePaths.gameSession.connectGame,
        handlerFunctionName: HandlerFunctionNames.gameSession.connectGame,
        environment: {
          [EnvironmentVariables.connectGame.tableName]: props.table.tableName,
          [EnvironmentVariables.connectGame.updatedConnectWindowInSeconds]:
            (21600).toString(),
        },
      }
    );

    const policyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:Query", "dynamodb:UpdateItem"],
    });

    connectHandlerFunction.lambdaFunction.addToRolePolicy(policyDocument);

    this.lambdaFunction = connectHandlerFunction.lambdaFunction;
  }
}
