import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  expressions,
  keys,
} from "@oigamez/dynamodb";

export const clearPlayerConnection = async ({
  hostSessionId,
  playerSessionId,
}) => {
  const input = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.player(hostSessionId, playerSessionId),
    UpdateExpression: "REMOVE #connectionId",
    ConditionExpression: expressions.common.keysExists,
    ExpressionAttributeNames: {
      "#connectionId": dynamoFieldNames.player.connectionId,
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};
