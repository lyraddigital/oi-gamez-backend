import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { Construct } from "constructs";

import { GameSessionSocketApiProps } from "../props";
import { ConnectGameLambda } from "./handlers";

export class GameSessionSocketApi extends Construct {
  public webSocketApi: WebSocketApi;
  public stageName: string;

  constructor(scope: Construct, id: string, props: GameSessionSocketApiProps) {
    super(scope, id);

    this.webSocketApi = new WebSocketApi(this, "GameSessionWebsocketAPI", {
      routeSelectionExpression: "$request.body.action",
    });

    const webSocketApiStage = new WebSocketStage(this, "ProductionStage", {
      webSocketApi: this.webSocketApi,
      stageName: "Production",
      autoDeploy: true,
    });

    const connectGameLambda = new ConnectGameLambda(this, "ConnectGameLambda", {
      table: props.table,
    });

    this.webSocketApi.addRoute("$connect", {
      integration: new WebSocketLambdaIntegration(
        "LambdaIntegration",
        connectGameLambda.lambdaFunction
      ),
    });

    this.stageName = webSocketApiStage.stageName;
  }
}
