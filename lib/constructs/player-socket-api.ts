import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { Construct } from "constructs";

import { PlayersSocketApiProps } from "../props";
import { ConnectToGameLambda, DisconnectFromGameLambda } from "./handlers";

export class PlayersSocketApi extends Construct {
  public webSocketApi: WebSocketApi;
  public stageName: string;

  constructor(scope: Construct, id: string, props: PlayersSocketApiProps) {
    super(scope, id);

    this.webSocketApi = new WebSocketApi(this, "PlayerWebsocketAPI", {
      routeSelectionExpression: "$request.body.action",
    });

    const webSocketApiStage = new WebSocketStage(this, "ProductionStage", {
      webSocketApi: this.webSocketApi,
      stageName: "Production",
      autoDeploy: true,
    });

    const connectToGameLambda = new ConnectToGameLambda(
      this,
      "ConnectToGameLambda",
      {
        table: props.table,
        webSocketApiId: props.gameSessionWebSocketApi.apiId,
        webSocketStage: props.gameSessionWebSocketStageName,
        webSocketAccount: props.account,
        webSocketRegion: props.region,
      }
    );

    const disconnectFromGameLambda = new DisconnectFromGameLambda(
      this,
      "DisconnectFromGameLambda",
      {
        table: props.table,
        webSocketApiId: props.gameSessionWebSocketApi.apiId,
        webSocketStage: props.gameSessionWebSocketStageName,
        webSocketAccount: props.account,
        webSocketRegion: props.region,
      }
    );

    this.webSocketApi.addRoute("$connect", {
      integration: new WebSocketLambdaIntegration(
        "LambdaIntegration",
        connectToGameLambda.lambdaFunction
      ),
    });

    this.webSocketApi.addRoute("$disconnect", {
      integration: new WebSocketLambdaIntegration(
        "DisconnectLambdaIntegration",
        disconnectFromGameLambda.lambdaFunction
      ),
    });

    this.stageName = webSocketApiStage.stageName;
  }
}
