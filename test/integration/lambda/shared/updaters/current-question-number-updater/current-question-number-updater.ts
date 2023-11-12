import { DynamoDbUpdater } from "../dynamo-db-updater";
import { dynamoFieldNames, dynamoFieldValues } from "../../dynamodb";

export class CurrentQuestionNumberUpdater extends DynamoDbUpdater {
  public async setQuestionNumber(
    sessionId: string,
    questionNumber: number
  ): Promise<void> {
    await this.executeUpdate(
      dynamoFieldValues.gameSession.pk(sessionId),
      dynamoFieldValues.gameSession.sk,
      "SET #currentQuestionNumber = :currentQuestionNumber",
      {
        "#currentQuestionNumber":
          dynamoFieldNames.gameSession.currentQuestionNumber,
      },
      {
        ":currentQuestionNumber":
          dynamoFieldValues.gameSession.currentQuestionNumber(questionNumber),
      }
    );
  }

  public async clear(sessionId: string): Promise<void> {
    await this.executeUpdate(
      dynamoFieldValues.gameSession.pk(sessionId),
      dynamoFieldValues.gameSession.sk,
      "REMOVE #currentQuestionNumber",
      {
        "#currentQuestionNumber":
          dynamoFieldNames.gameSession.currentQuestionNumber,
      }
    );
  }
}
