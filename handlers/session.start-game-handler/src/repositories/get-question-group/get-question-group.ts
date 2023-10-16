import {
  AttributeValue,
  GetItemCommand,
  GetItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import { dbClient, keys } from "@oigamez/dynamodb";

export const getQuestionGroupByNumber = async (
  questionGroupNumber: number
): Promise<Record<string, AttributeValue>> => {
  const input: GetItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.questionGroup(questionGroupNumber),
  };

  const command = new GetItemCommand(input);
  const response = await dbClient.send(command);

  return response.Item;
};
