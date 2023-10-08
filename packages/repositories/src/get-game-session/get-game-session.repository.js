import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import { dbClient, fieldNames, fieldValues } from "@oigamez/dynamodb";

export const getGameSession = async (sessionId, ttl) => {
  const input = {
    TableName: DYNAMO_TABLE_NAME,
    KeyConditionExpression: "#pk = :pk AND #sk = :sk",
    FilterExpression: "#ttl > :ttl",
    ExpressionAttributeNames: {
      "#pk": fieldNames.common.pk,
      "#sk": fieldNames.common.sk,
      "#ttl": fieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":pk": fieldValues.gameSession.pk(sessionId),
      ":sk": fieldValues.gameSession.sk,
      ":ttl": fieldValues.gameSession.ttl(ttl),
    },
  };
  const command = new QueryCommand(input);
  const response = await dbClient.send(command);

  return response?.Items?.length > 0 ? response.Items[0] : undefined;
};
