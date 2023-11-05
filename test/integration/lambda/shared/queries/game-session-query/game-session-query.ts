import { dynamoFieldValues } from "../../dynamodb";

import { mapFromDynamoToGameSession } from "../../mappers";
import { GameSession } from "../../models";

import { DynamoDbQuery } from "../dynamo-db-query";

export class GameSessionQuery extends DynamoDbQuery {
  public async getData(
    gameSessionId: string
  ): Promise<GameSession | undefined> {
    const gameSessionRecord = await this.executeGet(
      dynamoFieldValues.gameSession.pk(gameSessionId),
      dynamoFieldValues.gameSession.sk
    );

    return gameSessionRecord
      ? mapFromDynamoToGameSession(gameSessionRecord)
      : undefined;
  }
}
