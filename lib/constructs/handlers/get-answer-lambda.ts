import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
} from "../../constants";
import { GetAnswerLambdaProps } from "../../props";

import { RestAPIHandlerFunction } from "./rest-api-handler-function";

export class GetAnswerLambda extends Construct {
  constructor(scope: Construct, id: string, props: GetAnswerLambdaProps) {
    super(scope, id);

    const playerWebsocketEndpoint = `https://${props.webSocketApiId}.execute-api.${props.webSocketRegion}.amazonaws.com/${props.webSocketStage}`;
    const playerWebsocketApiPostArn = `arn:aws:execute-api:${props.webSocketRegion}:${props.webSocketAccount}:${props.webSocketApiId}/${props.webSocketStage}/POST/@connections/*`;
    const getAnswerLambda = new RestAPIHandlerFunction(this, "RestAPI", {
      handlerFileLocation: HandlerFilePaths.gameSession.getAnswer,
      handlerFunctionName: HandlerFunctionNames.gameSession.getAnswer,
      method: "GET",
      resource: props.resource,
      environment: {
        [EnvironmentVariables.getAnswer.tableName]: props.table.tableName,
        [EnvironmentVariables.getAnswer.playerWebsocketEndpoint]:
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

    getAnswerLambda.lambdaFunction.addToRolePolicy(dbPolicyDocument);
    getAnswerLambda.lambdaFunction.addToRolePolicy(apiExecPolicyDocument);
  }
}
