import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamoFieldValues,
  indexNames,
} from "@oigamez/dynamodb";

import { mapFromDynamoToPlayer } from "../mappers/index.js";

export const getPlayerBySessionId = async (sessionId, ttl) => {
  if (!sessionId) {
    return undefined;
  }

  const input = {
    TableName: DYNAMO_TABLE_NAME,
    IndexName: indexNames.playerSessionIndex,
    KeyConditionExpression: "#playerSessionId = :playerSessionId",
    FilterExpression: "#ttl > :ttl",
    ExpressionAttributeNames: {
      "#playerSessionId": dynamoFieldNames.player.sessionId,
      "#ttl": dynamoFieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":playerSessionId": dynamoFieldValues.player.sessionId(sessionId),
      ":ttl": dynamoFieldValues.player.ttl(ttl),
    },
  };

  const command = new QueryCommand(input);
  const response = await dbClient.send(command);
  const playerRecord =
    response?.Items?.length > 0 ? response.Items[0] : undefined;

  if (!playerRecord) {
    return undefined;
  }

  return mapFromDynamoToPlayer(playerRecord);
};
