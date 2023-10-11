import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamoFieldValues,
} from "@oigamez/dynamodb";

import { mapFromDynamoToGameSession } from "../mappers/index.js";

export const getGameSession = async (sessionId, ttl) => {
  const input = {
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
