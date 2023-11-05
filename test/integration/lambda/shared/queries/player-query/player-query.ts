import { dynamoFieldValues } from "../../dynamodb";
import { mapFromDynamoToPlayer } from "../../mappers";
import { Player } from "../../models";
import { DynamoDbQuery } from "../dynamo-db-query";

export class PlayerQuery extends DynamoDbQuery {
  public async get(
    hostSessionId: string,
    playerSessionId: string
  ): Promise<Player | undefined> {
    const playerRecord = await this.executeGet(
      dynamoFieldValues.player.pk(hostSessionId),
      dynamoFieldValues.player.sk(playerSessionId)
    );

    return playerRecord ? mapFromDynamoToPlayer(playerRecord) : undefined;
  }
}
