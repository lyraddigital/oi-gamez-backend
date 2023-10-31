import { Construct } from "constructs";
import {
  AttributeType,
  ProjectionType,
  TableV2,
} from "aws-cdk-lib/aws-dynamodb";

export class GameTable extends Construct {
  public table: TableV2;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new TableV2(this, "OIGamezData", {
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      timeToLiveAttribute: "TTL",
    });

    this.table.addGlobalSecondaryIndex({
      indexName: "GameCode-index",
      partitionKey: { name: "GameCode", type: AttributeType.STRING },
      projectionType: ProjectionType.INCLUDE,
      nonKeyAttributes: [
        "CurrentNumberOfPlayers",
        "MaxPlayers",
        "MinPlayers",
        "PK",
        "SessionId",
        "SK",
        "Status",
        "TTL",
      ],
    });

    this.table.addGlobalSecondaryIndex({
      indexName: "PlayerConnection-index",
      partitionKey: { name: "PlayerConnectionId", type: AttributeType.STRING },
      projectionType: ProjectionType.INCLUDE,
      nonKeyAttributes: ["HostSessionId", "PlayerSessionId", "TTL", "Username"],
    });

    this.table.addGlobalSecondaryIndex({
      indexName: "PlayerSession-index",
      partitionKey: { name: "PlayerSessionId", type: AttributeType.STRING },
      projectionType: ProjectionType.INCLUDE,
      nonKeyAttributes: [
        "HostSessionId",
        "QuestionChoices",
        "PlayerConnectionId",
        "TTL",
        "Username",
      ],
    });
  }
}
