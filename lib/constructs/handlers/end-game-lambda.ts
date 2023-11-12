import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
} from "../../constants";
import { EndGameLambdaProps } from "../../props";

import { RestAPIHandlerFunction } from "./rest-api-handler-function";

export class EndGameLambda extends Construct {
  constructor(scope: Construct, id: string, props: EndGameLambdaProps) {
    super(scope, id);

    const playerWebsocketEndpoint = `https://${props.webSocketApiId}.execute-api.${props.webSocketRegion}.amazonaws.com/${props.webSocketStage}`;
    const playerWebsocketApiPostArn = `arn:aws:execute-api:${props.webSocketRegion}:${props.webSocketAccount}:${props.webSocketApiId}/${props.webSocketStage}/POST/@connections/*`;
    const endGameLambda = new RestAPIHandlerFunction(this, "RestAPI", {
      handlerFileLocation: HandlerFilePaths.gameSession.endGame,
      handlerFunctionName: HandlerFunctionNames.gameSession.endGame,
      method: "PATCH",
      resource: props.resource,
      environment: {
        [EnvironmentVariables.endGame.tableName]: props.table.tableName,
        [EnvironmentVariables.endGame.playerWebsocketEndpoint]:
          playerWebsocketEndpoint,
      },
    });

    const dbPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:Query", "dynamodb:UpdateItem"],
    });

    const apiExecPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [playerWebsocketApiPostArn],
      actions: ["execute-api:ManageConnections"],
    });

    endGameLambda.lambdaFunction.addToRolePolicy(dbPolicyDocument);
    endGameLambda.lambdaFunction.addToRolePolicy(apiExecPolicyDocument);
  }
}
