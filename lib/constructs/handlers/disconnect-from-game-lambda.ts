import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
  IndexNames,
} from "../../constants";
import { DisconnectFromGameLambdaProps } from "../../props";
import { WebsocketAPIHandlerFunction } from "./websocket-api-handler-function";

export class DisconnectFromGameLambda extends Construct {
  public lambdaFunction: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    props: DisconnectFromGameLambdaProps
  ) {
    super(scope, id);

    const gameSessionWebsocketEndpoint = `https://${props.webSocketApiId}.execute-api.${props.webSocketRegion}.amazonaws.com/${props.webSocketStage}`;
    const gameSessionWebsocketApiPostArn = `arn:aws:execute-api:${props.webSocketRegion}:${props.webSocketAccount}:${props.webSocketApiId}/${props.webSocketStage}/POST/@connections/*`;
    const disconnectFromHandlerFunction = new WebsocketAPIHandlerFunction(
      this,
      "DisconnectFromHandlerFunction",
      {
        handlerFileLocation: HandlerFilePaths.player.disconnectFromGame,
        handlerFunctionName: HandlerFunctionNames.player.disconnectFromGame,
        environment: {
          [EnvironmentVariables.disconnectFromGame.tableName]:
            props.table.tableName,
          [EnvironmentVariables.disconnectFromGame
            .gameSessionWebsocketEndpoint]: gameSessionWebsocketEndpoint,
        },
      }
    );

    const dbTablePolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:Query", "dynamodb:UpdateItem", "dynamodb:DeleteItem"],
    });

    const dbIndexPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [
        `${props.table.tableArn}/index/${IndexNames.playerConnectionIndexName}`,
      ],
      actions: ["dynamodb:Query"],
    });

    const apiExecPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [gameSessionWebsocketApiPostArn],
      actions: ["execute-api:ManageConnections"],
    });

    disconnectFromHandlerFunction.lambdaFunction.addToRolePolicy(
      dbTablePolicyDocument
    );

    disconnectFromHandlerFunction.lambdaFunction.addToRolePolicy(
      dbIndexPolicyDocument
    );

    disconnectFromHandlerFunction.lambdaFunction.addToRolePolicy(
      apiExecPolicyDocument
    );

    this.lambdaFunction = disconnectFromHandlerFunction.lambdaFunction;
  }
}
