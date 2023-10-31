import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
} from "../../constants";
import { StartGameLambdaProps } from "../../props";

import { RestAPIHandlerFunction } from "./rest-api-handler-function";

export class StartGameLambda extends Construct {
  constructor(scope: Construct, id: string, props: StartGameLambdaProps) {
    super(scope, id);

    const playerWebsocketEndpoint = `https://${props.webSocketApiId}.execute-api.${props.webSocketRegion}.amazonaws.com/${props.webSocketStage}`;
    const playerWebsocketApiPostArn = `arn:aws:execute-api:${props.webSocketRegion}:${props.webSocketAccount}:${props.webSocketApiId}/${props.webSocketStage}/POST/@connections/*`;
    const startGameLambda = new RestAPIHandlerFunction(this, "RestAPI", {
      handlerFileLocation: HandlerFilePaths.gameSession.startGame,
      handlerFunctionName: HandlerFunctionNames.gameSession.startGame,
      method: "PATCH",
      resource: props.resource,
      environment: {
        [EnvironmentVariables.startGame.tableName]: props.table.tableName,
        [EnvironmentVariables.startGame.playerWebsocketEndpoint]:
          playerWebsocketEndpoint,
      },
    });

    const dbPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:Query", "dynamodb:GetItem", "dynamodb:UpdateItem"],
    });

    const apiExecPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [playerWebsocketApiPostArn],
      actions: ["execute-api:ManageConnections"],
    });

    startGameLambda.lambdaFunction.addToRolePolicy(dbPolicyDocument);
    startGameLambda.lambdaFunction.addToRolePolicy(apiExecPolicyDocument);
  }
}
