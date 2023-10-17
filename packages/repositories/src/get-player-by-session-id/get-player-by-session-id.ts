import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamoFieldValues,
  IndexNames,
} from "@oigamez/dynamodb";

import { mapFromDynamoToPlayer } from "../mappers";
import { Player } from "../models";

export const getPlayerBySessionId = async (
  sessionId: string,
  ttl: number
): Promise<Player | undefined> => {
  if (!sessionId) {
    return undefined;
  }

  const input: QueryCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    IndexName: IndexNames.playerSessionIndex,
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
