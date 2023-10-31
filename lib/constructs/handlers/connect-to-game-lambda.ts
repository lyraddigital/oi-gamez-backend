import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
  IndexNames,
} from "../../constants";
import { ConnectToGameLambdaProps } from "../../props";
import { WebsocketAPIHandlerFunction } from "./websocket-api-handler-function";

export class ConnectToGameLambda extends Construct {
  public lambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: ConnectToGameLambdaProps) {
    super(scope, id);

    const gameSessionWebsocketEndpoint = `https://${props.webSocketApiId}.execute-api.${props.webSocketRegion}.amazonaws.com/${props.webSocketStage}`;
    const gameSessionWebsocketApiPostArn = `arn:aws:execute-api:${props.webSocketRegion}:${props.webSocketAccount}:${props.webSocketApiId}/${props.webSocketStage}/POST/@connections/*`;
    const connectToHandlerFunction = new WebsocketAPIHandlerFunction(
      this,
      "ConnectToHandlerFunction",
      {
        handlerFileLocation: HandlerFilePaths.player.connectToGame,
        handlerFunctionName: HandlerFunctionNames.player.connectToGame,
        environment: {
          [EnvironmentVariables.connectToGame.tableName]: props.table.tableName,
          [EnvironmentVariables.connectToGame.gameSessionWebsocketEndpoint]:
            gameSessionWebsocketEndpoint,
        },
      }
    );

    const dbTablePolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:Query", "dynamodb:UpdateItem"],
    });

    const dbIndexPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [
        `${props.table.tableArn}/index/${IndexNames.playerSessionIndexName}`,
      ],
      actions: ["dynamodb:Query"],
    });

    const apiExecPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [gameSessionWebsocketApiPostArn],
      actions: ["execute-api:ManageConnections"],
    });

    connectToHandlerFunction.lambdaFunction.addToRolePolicy(
      dbTablePolicyDocument
    );

    connectToHandlerFunction.lambdaFunction.addToRolePolicy(
      dbIndexPolicyDocument
    );

    connectToHandlerFunction.lambdaFunction.addToRolePolicy(
      apiExecPolicyDocument
    );

    this.lambdaFunction = connectToHandlerFunction.lambdaFunction;
  }
}
