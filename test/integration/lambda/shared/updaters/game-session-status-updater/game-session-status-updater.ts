import { dynamoFieldNames, dynamoFieldValues } from "../../dynamodb";
import { DynamoDbUpdater } from "../dynamo-db-updater";

export class GameSessionStatusUpdater extends DynamoDbUpdater {
  public async update(sessionId: string, status: string) {
    await this.executeUpdate(
      dynamoFieldValues.gameSession.pk(sessionId),
      dynamoFieldValues.gameSession.sk,
      "SET #status = :status",
      {
        "#status": dynamoFieldNames.gameSession.status,
      },
      {
        ":status": dynamoFieldValues.gameSession.status(status),
      }
    );
  }
}
