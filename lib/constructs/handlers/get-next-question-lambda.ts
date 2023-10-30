import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
} from "../../constants";
import { GetNextQuestionLambdaProps } from "../../props";

import { RestAPIHandlerFunction } from "./rest-api-handler-function";

export class GetNextQuestionLambda extends Construct {
  constructor(scope: Construct, id: string, props: GetNextQuestionLambdaProps) {
    super(scope, id);

    const playerWebsocketEndpoint = `https://${props.webSocketApiId}.execute-api.${props.webSocketRegion}.amazonaws.com/${props.webSocketStage}`;
    const playerWebsocketApiPostArn = `arn:aws:execute-api:${props.webSocketRegion}:${props.webSocketAccount}:${props.webSocketApiId}/${props.webSocketStage}/POST/@connections/*`;
    const getNextQuestionLambda = new RestAPIHandlerFunction(this, "RestAPI", {
      handlerFileLocation: HandlerFilePaths.gameSession.getNextQuestion,
      handlerFunctionName: HandlerFunctionNames.gameSession.getNextQuestion,
      method: "GET",
      resource: props.resource,
      environment: {
        [EnvironmentVariables.getNextQuestion.tableName]: props.table.tableName,
        [EnvironmentVariables.getNextQuestion.playerWebsocketEndpoint]:
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

    getNextQuestionLambda.lambdaFunction.addToRolePolicy(dbPolicyDocument);
    getNextQuestionLambda.lambdaFunction.addToRolePolicy(apiExecPolicyDocument);
  }
}
