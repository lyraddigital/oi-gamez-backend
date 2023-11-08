import { dynamoFieldNames, dynamoFieldValues } from "../../dynamodb";
import { DynamoDbUpdater } from "../dynamo-db-updater";

export class PlayerHostSessionUpdater extends DynamoDbUpdater {
  public async update(
    hostSessionId: string,
    playerSessionId: string,
    updatedHostSessionId: string
  ): Promise<void> {
    return this.executeUpdate(
      dynamoFieldValues.player.pk(hostSessionId),
      dynamoFieldValues.player.sk(playerSessionId),
      "SET #hostSessionId = :hostSessionId",
      {
        "#hostSessionId": dynamoFieldNames.player.hostSessionId,
      },
      {
        ":hostSessionId":
          dynamoFieldValues.player.hostSessionId(updatedHostSessionId),
      }
    );
  }
}
