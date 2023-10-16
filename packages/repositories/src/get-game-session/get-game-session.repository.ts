import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamoFieldValues,
} from "@oigamez/dynamodb";

import { GameSession } from "../models/index.js";
import { mapFromDynamoToGameSession } from "../mappers/index.js";

export const getGameSession = async (
  sessionId: string,
  ttl: number
): Promise<GameSession | undefined> => {
  if (!sessionId) {
    return undefined;
  }

  const input: QueryCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    KeyConditionExpression: "#pk = :pk AND #sk = :sk",
    FilterExpression: "#ttl > :ttl",
    ExpressionAttributeNames: {
      "#pk": dynamoFieldNames.common.pk,
      "#sk": dynamoFieldNames.common.sk,
      "#ttl": dynamoFieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":pk": dynamoFieldValues.gameSession.pk(sessionId),
      ":sk": dynamoFieldValues.gameSession.sk,
      ":ttl": dynamoFieldValues.gameSession.ttl(ttl),
    },
  };
  const command = new QueryCommand(input);
  const response = await dbClient.send(command);

  if (!response?.Items?.length) {
    return undefined;
  }

  return mapFromDynamoToGameSession(response.Items[0]);
};
