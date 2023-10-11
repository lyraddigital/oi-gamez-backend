import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamoFieldValues,
} from "@oigamez/dynamodb";

export const createPlayer = async (
  gameSessionId,
  playerSessionId,
  username,
  ttl
) => {
  const input = {
    TableName: DYNAMO_TABLE_NAME,
    Item: {
      [dynamoFieldNames.common.pk]: dynamoFieldValues.player.pk(gameSessionId),
      [dynamoFieldNames.common.sk]:
        dynamoFieldValues.player.sk(playerSessionId),
      [dynamoFieldNames.player.hostSessionId]:
        dynamoFieldValues.player.hostSessionId(gameSessionId),
      [dynamoFieldNames.player.sessionId]:
        dynamoFieldValues.player.sessionId(playerSessionId),
      [dynamoFieldNames.player.username]:
        dynamoFieldValues.player.username(username),
      [dynamoFieldNames.common.type]: dynamoFieldValues.player.type,
      [dynamoFieldNames.common.ttl]: dynamoFieldValues.player.ttl(ttl),
    },
  };

  const command = new PutItemCommand(input);

  await dbClient.send(command);
};
