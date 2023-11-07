import { Construct } from "constructs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
  IndexNames,
} from "../../constants";
import { GetGameSessionStatusLambdaProps } from "../../props";

import { RestAPIHandlerFunction } from "./rest-api-handler-function";

export class GetGameSessionStatusLambda extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: GetGameSessionStatusLambdaProps
  ) {
    super(scope, id);

    const playGameLambda = new RestAPIHandlerFunction(this, "RestAPI", {
      handlerFileLocation: HandlerFilePaths.player.getGameStatus,
      handlerFunctionName: HandlerFunctionNames.player.getGameStatus,
      method: "GET",
      resource: props.resource,
      environment: {
        [EnvironmentVariables.getGameStatus.tableName]: props.table.tableName,
        [EnvironmentVariables.getGameStatus.gameCodeLength]: (4).toString(),
        [EnvironmentVariables.getGameStatus.corsAllowedOrigins]:
          props.allowedOrigins,
      },
    });

    const dbTablePolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:Query", "dynamodb:GetItem", "dynamodb:PutItem"],
    });

    const dbIndexPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [`${props.table.tableArn}/index/${IndexNames.gameCodeIndex}`],
      actions: ["dynamodb:Query", "dynamodb:GetItem", "dynamodb:PutItem"],
    });

    playGameLambda.lambdaFunction.addToRolePolicy(dbTablePolicyDocument);
    playGameLambda.lambdaFunction.addToRolePolicy(dbIndexPolicyDocument);
  }
}
