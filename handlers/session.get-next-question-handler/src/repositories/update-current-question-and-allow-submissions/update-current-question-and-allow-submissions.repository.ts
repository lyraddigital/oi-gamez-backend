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
  numberAttribute,
} from "@oigamez/dynamodb";

export const updateCurrentQuestionAndAllowSubmissions = async (
  gameSessionId: string
): Promise<void> => {
  const input: UpdateItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.gameSession(gameSessionId),
    ConditionExpression: expressions.common.keysExists,
    UpdateExpression:
      "SET #isAllowingSubmissions = :isAllowingSubmissions, #currentQuestionNumber = #currentQuestionNumber + :increment",
    ExpressionAttributeNames: {
      "#isAllowingSubmissions":
        dynamoFieldNames.gameSession.isAllowingSubmissions,
      "#currentQuestionNumber":
        dynamoFieldNames.gameSession.currentQuestionNumber,
    },
    ExpressionAttributeValues: {
      ":isAllowingSubmissions":
        dynamoFieldValues.gameSession.isAllowingSubmissions(true),
      ":increment": numberAttribute(1),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};
