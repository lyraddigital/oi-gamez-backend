import { Construct } from "constructs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
} from "../../constants";
import { PlayGameLambdaProps } from "../../props";
import { RestAPIHandlerFunction } from "./rest-api-handler-function";

export class PlayGameLambda extends Construct {
  constructor(scope: Construct, id: string, props: PlayGameLambdaProps) {
    super(scope, id);

    const playGameLambda = new RestAPIHandlerFunction(this, "RestAPI", {
      handlerFileLocation: HandlerFilePaths.gameSession.playGame,
      handlerFunctionName: HandlerFunctionNames.gameSession.playGame,
      method: "POST",
      resource: props.resource,
      environment: {
        [EnvironmentVariables.playGame.tableName]: props.table.tableName,
        [EnvironmentVariables.playGame.gameCodeLength]: (4).toString(),
        [EnvironmentVariables.playGame.connectWindowInSeconds]: (30).toString(),
        [EnvironmentVariables.playGame.gameSessionMinPlayers]: (2).toString(),
        [EnvironmentVariables.playGame.gameSessionMaxPlayers]: (8).toString(),
      },
    });

    const policyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem"],
    });

    playGameLambda.lambdaFunction.addToRolePolicy(policyDocument);
  }
}
