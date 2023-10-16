import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamoFieldValues,
  IndexNames,
} from "@oigamez/dynamodb";

import { mapFromDynamoToGameSession } from "../mappers/index.js";
import { GameSession } from "../models/index.js";

export const getGameSessionByCode = async (
  code: string,
  ttl: number
): Promise<GameSession | undefined> => {
  const input: QueryCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    IndexName: IndexNames.gameCodeIndex,
    KeyConditionExpression: "#gameCode = :gameCode",
    FilterExpression: "#ttl > :ttl",
    ExpressionAttributeNames: {
      "#gameCode": dynamoFieldNames.gameSession.gameCode,
      "#ttl": dynamoFieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":gameCode": dynamoFieldValues.gameSession.gameCode(code),
      ":ttl": dynamoFieldValues.gameSession.ttl(ttl),
    },
  };

  const command = new QueryCommand(input);
  const response = await dbClient.send(command);
  const gameSessionRecord =
    response?.Items?.length > 0 ? response.Items[0] : undefined;

  if (!gameSessionRecord) {
    return undefined;
  }

  return mapFromDynamoToGameSession(gameSessionRecord);
};
