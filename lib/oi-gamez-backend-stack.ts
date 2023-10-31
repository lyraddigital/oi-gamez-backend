import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  GameSessionRestApi,
  GameSessionSocketApi,
  GameTable,
  PlayersRestApi,
  PlayersSocketApi,
} from "./constructs";

export class OiGamezBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const gameTable = new GameTable(this, "GameTable");
    const gameSessionSocketApi = new GameSessionSocketApi(
      this,
      "GameSessionWebsocketAPI",
      {
        table: gameTable.table,
      }
    );
    const playersSocketApi = new PlayersSocketApi(this, "PlayerWebsocketAPI", {
      table: gameTable.table,
      gameSessionWebSocketApi: gameSessionSocketApi.webSocketApi,
      gameSessionWebSocketStageName: gameSessionSocketApi.stageName,
      account: this.account,
      region: this.region,
    });

    new GameSessionRestApi(this, "GameSessionHttpApi", {
      table: gameTable.table,
      account: this.account,
      region: this.region,
      playerSocketApi: playersSocketApi.webSocketApi,
      playerWebSocketStageName: playersSocketApi.stageName,
    });

    new PlayersRestApi(this, "PlayerHttpApi", {
      table: gameTable.table,
      account: this.account,
      region: this.region,
      gameSessionSocketApi: gameSessionSocketApi.webSocketApi,
    });
  }
}
