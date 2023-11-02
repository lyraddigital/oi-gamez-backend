import {
  dynamoFieldNames,
  dynamoFieldValues,
  getDynamoSet,
} from "../../dynamodb";
import { mapFromDynamoToGameSession } from "../../mappers";

import { DynamoDbQuery } from "../dynamo-db-query";
import { GameAndSessionList } from "./game-and-session-list";

export class GameSessionAndListQuery extends DynamoDbQuery {
  public async getData(gameSessionId: string): Promise<GameAndSessionList> {
    const gameSessionPromise = this.executeGet(
      dynamoFieldValues.gameSession.pk(gameSessionId),
      dynamoFieldValues.gameSession.sk
    );
    const gameListPromise = this.executeGet(
      dynamoFieldValues.gameList.pk,
      dynamoFieldValues.gameList.sk
    );

    const [gameSessionRecord, gameListRecord] = await Promise.all([
      gameSessionPromise,
      gameListPromise,
    ]);

    return {
      gameList: gameListRecord
        ? {
            gameCodes: getDynamoSet(
              gameListRecord[dynamoFieldNames.gameList.gameCodes]
            ),
          }
        : undefined,
      gameSession: gameSessionRecord
        ? mapFromDynamoToGameSession(gameSessionRecord)
        : undefined,
    };
  }
}
