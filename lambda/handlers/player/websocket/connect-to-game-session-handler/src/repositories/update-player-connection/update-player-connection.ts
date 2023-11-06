import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  expressions,
  dynamoFieldNames,
  dynamoFieldValues,
  keys,
} from "@oigamez/dynamodb";

import { UpdatePlayerConnection } from "../../models";

export const updatePlayerConnection = async ({
  playerSessionId,
  hostSessionId,
  connectionId,
}: UpdatePlayerConnection) => {
  const input: UpdateItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    UpdateExpression: "SET #connId = :connId",
    Key: keys.player(hostSessionId, playerSessionId),
    ConditionExpression: expressions.common.keysExists,
    ExpressionAttributeNames: {
      "#connId": dynamoFieldNames.player.connectionId,
    },
    ExpressionAttributeValues: {
      ":connId": dynamoFieldValues.player.connectionId(connectionId),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};
