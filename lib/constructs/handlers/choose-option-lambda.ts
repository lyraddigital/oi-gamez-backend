import { Construct } from "constructs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import {
  EnvironmentVariables,
  HandlerFilePaths,
  HandlerFunctionNames,
  IndexNames,
} from "../../constants";
import { ChooseOptionLambdaProps } from "../../props";

import { RestAPIHandlerFunction } from "./rest-api-handler-function";

export class ChooseOptionLambda extends Construct {
  constructor(scope: Construct, id: string, props: ChooseOptionLambdaProps) {
    super(scope, id);

    const chooseOptionLambda = new RestAPIHandlerFunction(this, "RestAPI", {
      handlerFileLocation: HandlerFilePaths.player.chooseOption,
      handlerFunctionName: HandlerFunctionNames.player.chooseOption,
      method: "PATCH",
      resource: props.resource,
      environment: {
        [EnvironmentVariables.chooseOption.tableName]: props.table.tableName,
        [EnvironmentVariables.chooseOption.corsAllowedOrigins]:
          props.allowedOrigins,
      },
    });

    const dbTablePolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.table.tableArn],
      actions: ["dynamodb:Query", "dynamodb:UpdateItem"],
    });

    const dbIndexPolicyDocument = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [
        `${props.table.tableArn}/index/${IndexNames.playerSessionIndexName}`,
      ],
      actions: ["dynamodb:Query"],
    });

    chooseOptionLambda.lambdaFunction.addToRolePolicy(dbTablePolicyDocument);
    chooseOptionLambda.lambdaFunction.addToRolePolicy(dbIndexPolicyDocument);
  }
}
