import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamofieldValues,
  indexNames,
} from "@oigamez/dynamodb";

import { mapFromDynamoToGameSession } from "../mappers/index.js";

export const getGameSessionByCode = async (code, ttl) => {
  const input = {
    TableName: DYNAMO_TABLE_NAME,
    IndexName: indexNames.gameCodeIndex,
    KeyConditionExpression: "#gameCode = :gameCode",
    FilterExpression: "#ttl > :ttl",
    ExpressionAttributeNames: {
      "#gameCode": dynamoFieldNames.gameSession.gameCode,
      "#ttl": dynamoFieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":gameCode": dynamofieldValues.gameSession.gameCode(code),
      ":ttl": dynamofieldValues.gameSession.ttl(ttl),
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
