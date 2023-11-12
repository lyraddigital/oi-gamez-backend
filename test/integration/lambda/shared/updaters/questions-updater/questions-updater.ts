import { dynamoFieldNames, dynamoFieldValues } from "../../dynamodb";
import { DynamoDbUpdater } from "../dynamo-db-updater";

export class QuestionsUpdater extends DynamoDbUpdater {
  public async clear(sessionId: string): Promise<void> {
    return this.executeUpdate(
      dynamoFieldValues.gameSession.pk(sessionId),
      dynamoFieldValues.gameSession.sk,
      "REMOVE #questions",
      {
        "#questions": dynamoFieldNames.gameSession.questions,
      }
    );
  }
}
