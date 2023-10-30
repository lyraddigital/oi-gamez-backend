import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration/dynamo-table-name";
import {
  dbClient,
  expressions,
  dynamoFieldNames,
  dynamoFieldValues,
  keys,
} from "@oigamez/dynamodb";

export const getCurrentQuestionAndAnswer = async (
  gameSessionId: string
): Promise<void> => {
  const input: UpdateItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.gameSession(gameSessionId),
    ConditionExpression: expressions.common.keysExists,
    UpdateExpression: "SET #isAllowingSubmissions = :isAllowingSubmissions",
    ExpressionAttributeNames: {
      "#isAllowingSubmissions":
        dynamoFieldNames.gameSession.isAllowingSubmissions,
    },
    ExpressionAttributeValues: {
      ":isAllowingSubmissions":
        dynamoFieldValues.gameSession.isAllowingSubmissions(false),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};
