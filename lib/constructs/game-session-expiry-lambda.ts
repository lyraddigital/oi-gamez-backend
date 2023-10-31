import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
} from "../constants";
import { GameSessionExpiryLambdaProps } from "../props";
import { JobHandlerFunction } from "./job-handler-function";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class GameSessionExpiryLambda extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: GameSessionExpiryLambdaProps
  ) {
    super(scope, id);

    const expiryLambdaFunction = new JobHandlerFunction(
      this,
      "GameSessionExpiryHandlerFunction",
      {
        handlerFileLocation: HandlerFilePaths.gameSession.expiryJob,
        handlerFunctionName: HandlerFunctionNames.gameSession.expiryJob,
        environment: {
          [EnvironmentVariables.gameSessionExpiryJob.tableName]:
            props.table.tableName,
        },
      }
    );

    expiryLambdaFunction.lambdaFunction.addEventSource(
      new DynamoEventSource(props.table, {
        startingPosition: StartingPosition.TRIM_HORIZON,
        retryAttempts: 3,
      })
    );

    var policyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:UpdateItem"],
    });

    expiryLambdaFunction.lambdaFunction.addToRolePolicy(policyDocument);
  }
}
