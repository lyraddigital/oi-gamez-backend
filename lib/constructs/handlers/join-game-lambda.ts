import { Construct } from "constructs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
  IndexNames,
} from "../../constants";
import { JoinGameLambdaProps } from "../../props";

import { RestAPIHandlerFunction } from "./rest-api-handler-function";

export class JoinGameLambda extends Construct {
  constructor(scope: Construct, id: string, props: JoinGameLambdaProps) {
    super(scope, id);

    const playGameLambda = new RestAPIHandlerFunction(this, "RestAPI", {
      handlerFileLocation: HandlerFilePaths.player.joinGame,
      handlerFunctionName: HandlerFunctionNames.player.joinGame,
      method: "POST",
      resource: props.resource,
      environment: {
        [EnvironmentVariables.joinGame.tableName]: props.table.tableName,
        [EnvironmentVariables.joinGame.connectWindowInSeconds]: (30).toString(),
        [EnvironmentVariables.joinGame.gameCodeLength]: (4).toString(),
        [EnvironmentVariables.joinGame.corsAllowedOrigins]:
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
