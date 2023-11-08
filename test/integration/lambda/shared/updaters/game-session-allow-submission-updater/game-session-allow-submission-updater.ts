import { dynamoFieldNames, dynamoFieldValues } from "../../dynamodb";
import { DynamoDbUpdater } from "../dynamo-db-updater";

export class GameSessionAllowSubmissionsUpdater extends DynamoDbUpdater {
  public async update(
    sessionId: string,
    isAllowingSubmissions: boolean
  ): Promise<void> {
    return await this.executeUpdate(
      dynamoFieldValues.gameSession.pk(sessionId),
      dynamoFieldValues.gameSession.sk,
      "SET #isAllowingSubmissions = :isAllowingSubmission",
      {
        "#isAllowingSubmissions":
          dynamoFieldNames.gameSession.isAllowingSubmissions,
      },
      {
        ":isAllowingSubmission":
          dynamoFieldValues.gameSession.isAllowingSubmissions(
            isAllowingSubmissions
          ),
      }
    );
  }
}
