import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
} from "../../constants";
import { CompleteGameLambdaProps } from "../../props";

import { RestAPIHandlerFunction } from "./rest-api-handler-function";

export class CompleteGameLambda extends Construct {
  constructor(scope: Construct, id: string, props: CompleteGameLambdaProps) {
    super(scope, id);

    const playerWebsocketEndpoint = `https://${props.webSocketApiId}.execute-api.${props.webSocketRegion}.amazonaws.com/${props.webSocketStage}`;
    const playerWebsocketApiPostArn = `arn:aws:execute-api:${props.webSocketRegion}:${props.webSocketAccount}:${props.webSocketApiId}/${props.webSocketStage}/POST/@connections/*`;
    const completeGameLambda = new RestAPIHandlerFunction(this, "RestAPI", {
      handlerFileLocation: HandlerFilePaths.gameSession.completeGame,
      handlerFunctionName: HandlerFunctionNames.gameSession.completeGame,
      method: "PATCH",
      resource: props.resource,
      environment: {
        [EnvironmentVariables.completeGame.tableName]: props.table.tableName,
        [EnvironmentVariables.completeGame.playerWebsocketEndpoint]:
          playerWebsocketEndpoint,
      },
    });

    const dbPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:Query"],
    });

    const apiExecPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [playerWebsocketApiPostArn],
      actions: ["execute-api:ManageConnections"],
    });

    completeGameLambda.lambdaFunction.addToRolePolicy(dbPolicyDocument);
    completeGameLambda.lambdaFunction.addToRolePolicy(apiExecPolicyDocument);
  }
}
