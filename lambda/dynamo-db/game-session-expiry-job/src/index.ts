import { DynamoDBStreamEvent } from "aws-lambda";
import { Types, dynamoFieldNames } from "@oigamez/dynamodb";

import { removeCodeFromGameList } from "./repositories";

export const handler = async (
  dynamoEvent: DynamoDBStreamEvent
): Promise<void> => {
  for (let record of dynamoEvent.Records) {
    const isGameSession =
      record.dynamodb?.OldImage &&
      record.dynamodb.OldImage[dynamoFieldNames.common.type]?.S ==
        Types.gameSession;
    const gameCode = record.dynamodb?.OldImage
      ? record.dynamodb.OldImage[dynamoFieldNames.gameSession.gameCode]?.S || ""
      : "";
    const hasGameCode = !!gameCode;

    if (isGameSession && hasGameCode) {
      await removeCodeFromGameList(gameCode);
    }
  }
};
