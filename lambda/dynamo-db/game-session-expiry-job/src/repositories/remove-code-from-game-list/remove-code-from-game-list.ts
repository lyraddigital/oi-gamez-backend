import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  dynamoFieldValues,
  expressions,
  keys,
} from "@oigamez/dynamodb";

export const removeCodeFromGameList = async (
  gameCode: string
): Promise<void> => {
  const input: UpdateItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.gameList,
    UpdateExpression: "DELETE #gameCodes :gameCode",
    ConditionExpression: expressions.common.keysExists,
    ExpressionAttributeNames: {
      "#gameCodes": dynamoFieldNames.gameList.gameCodes,
    },
    ExpressionAttributeValues: {
      ":gameCode": dynamoFieldValues.gameList.gameCodes([gameCode]),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};
