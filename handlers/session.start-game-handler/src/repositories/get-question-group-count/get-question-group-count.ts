import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import { dbClient, keys } from "@oigamez/dynamodb";

import { mapFromDynamoToQuestionGroupCount } from "../mappers";
import { QuestionGroupCount } from "../../models";

export const getQuestionGroupCount = async (): Promise<QuestionGroupCount> => {
  const input: GetItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.questionGroupCount,
  };

  const command = new GetItemCommand(input);
  const response = await dbClient.send(command);

  return mapFromDynamoToQuestionGroupCount(response.Item);
};
