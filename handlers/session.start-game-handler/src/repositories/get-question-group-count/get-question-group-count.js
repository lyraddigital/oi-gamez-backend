import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import { dbClient, keys } from "@oigamez/dynamodb";

import { mapFromDynamoToQuestionGroupCount } from "../mappers/index.js";

export const getQuestionGroupCount = async () => {
  const input = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.questionGroupCount,
  };

  const command = new GetItemCommand(input);
  const response = await dbClient.send(command);

  return mapFromDynamoToQuestionGroupCount(response.Item);
};
