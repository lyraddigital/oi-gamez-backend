import { dynamoFieldNames, dynamoFieldValues } from "../../dynamodb";
import { DynamoDbUpdater } from "../dynamo-db-updater";

export class GameSessionNumberOfPlayersUpdater extends DynamoDbUpdater {
  public async update(sessionId: string, currentNumberOfPlayers: number) {
    await this.executeUpdate(
      dynamoFieldValues.gameSession.pk(sessionId),
      dynamoFieldValues.gameSession.sk,
      "SET #currentNumberOfPlayers = :currentNumberOfPlayers",
      {
        "#currentNumberOfPlayers":
          dynamoFieldNames.gameSession.currentNumberOfPlayers,
      },
      {
        ":currentNumberOfPlayers":
          dynamoFieldValues.gameSession.currentNumberOfPlayers(
            currentNumberOfPlayers
          ),
      }
    );
  }
}
