import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamoFieldValues,
} from "@oigamez/dynamodb";

import { mapFromDynamoToPlayer } from "../mappers";
import { GameSession, Player } from "../models";

export const getPlayersInGameSession = async (
  gameSession: GameSession,
  ttl: number
): Promise<Player[]> => {
  if (!gameSession?.sessionId) {
    return [];
  }

  const sessionId = gameSession.sessionId;
  const input: QueryCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk,:sk)",
    FilterExpression: "#ttl > :ttl",
    ExpressionAttributeNames: {
      "#pk": dynamoFieldNames.common.pk,
      "#sk": dynamoFieldNames.common.sk,
      "#ttl": dynamoFieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":pk": dynamoFieldValues.player.pk(sessionId),
      ":sk": dynamoFieldValues.player.skPrefix,
      ":ttl": dynamoFieldValues.player.ttl(ttl),
    },
  };

  const command = new QueryCommand(input);
  const response = await dbClient.send(command);

  if (!response?.Items?.length) {
    return [];
  }

  return response.Items.map(mapFromDynamoToPlayer);
};
