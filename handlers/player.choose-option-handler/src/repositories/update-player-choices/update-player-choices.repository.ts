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

export const updatePlayerChoices = async (
  playerSessionId: string,
  hostSessionId: string,
  choices: Map<number, string>
) => {
  const input: UpdateItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.player(hostSessionId, playerSessionId),
    ConditionExpression: expressions.common.keysExists,
    UpdateExpression: "SET #choices = :choices",
    ExpressionAttributeNames: {
      "#choices": dynamoFieldNames.player.choices,
    },
    ExpressionAttributeValues: {
      ":choices": dynamoFieldValues.player.choices(choices),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};
