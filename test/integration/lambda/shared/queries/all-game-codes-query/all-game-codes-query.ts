import {
  dynamoFieldNames,
  dynamoFieldValues,
  getDynamoSet,
} from "../../dynamodb";
import { DynamoDbQuery } from "../dynamo-db-query";

export class AllGameCodesQuery extends DynamoDbQuery {
  public async getData(): Promise<string[]> {
    const gameListRecord = await this.executeGet(
      dynamoFieldValues.gameList.pk,
      dynamoFieldValues.gameList.sk
    );

    return gameListRecord
      ? getDynamoSet(gameListRecord[dynamoFieldNames.gameList.gameCodes])
      : [];
  }
}
