import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamoFieldValues,
  IndexNames,
} from "@oigamez/dynamodb";
import { mapFromDynamoToPlayer } from "@oigamez/mappers";
import { Player } from "@oigamez/models";

export const getPlayerByConnectionId = async (
  connectionId: string,
  ttl: number
): Promise<Player | undefined> => {
  if (!connectionId) {
    return undefined;
  }

  const input: QueryCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    IndexName: IndexNames.playerConnectionIndex,
    KeyConditionExpression: "#playerConnectionId = :playerConnectionId",
    FilterExpression: "#ttl > :ttl",
    ExpressionAttributeNames: {
      "#playerConnectionId": dynamoFieldNames.player.connectionId,
      "#ttl": dynamoFieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":playerConnectionId":
        dynamoFieldValues.player.connectionId(connectionId),
      ":ttl": dynamoFieldValues.player.ttl(ttl),
    },
  };

  const command = new QueryCommand(input);
  const response = await dbClient.send(command);
  const playerRecord =
    response?.Items && response.Items.length > 0
      ? response.Items[0]
      : undefined;

  if (!playerRecord) {
    return undefined;
  }

  return mapFromDynamoToPlayer(playerRecord);
};
