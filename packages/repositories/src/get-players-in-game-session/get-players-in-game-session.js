import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamofieldValues,
} from "@oigamez/dynamodb";

import { mapFromDynamoToPlayer } from "../mappers/index.js";

export const getPlayersInGameSession = async (gameSession, ttl) => {
  if (!gameSession?.sessionId) {
    return [];
  }

  const sessionId = gameSession.sessionId;
  const input = {
    TableName: DYNAMO_TABLE_NAME,
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk,:sk)",
    FilterExpression: "#ttl > :ttl",
    ExpressionAttributeNames: {
      "#pk": dynamoFieldNames.common.pk,
      "#sk": dynamoFieldNames.common.sk,
      "#ttl": dynamoFieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":pk": dynamofieldValues.player.pk(sessionId),
      ":sk": dynamofieldValues.player.skPrefix,
      ":ttl": dynamofieldValues.player.ttl(ttl),
    },
  };

  const command = new QueryCommand(input);
  const response = await dbClient.send(command);

  if (!response?.Items?.length) {
    return [];
  }

  return response.Items.map(mapFromDynamoToPlayer);
};
