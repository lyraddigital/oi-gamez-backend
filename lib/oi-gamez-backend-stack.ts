import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { GameSessionRestApi, GameTable } from "./constructs";

export class OiGamezBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const gameTable = new GameTable(this, "GameTable");

    new GameSessionRestApi(this, "GameSessionHttpApi", {
      table: gameTable.Table,
      account: this.account,
      region: this.region,
    });
  }
}
