import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration/dynamo-table-name";
import {
  dbClient,
  dynamoFieldNames,
  getDynamoSet,
  keys,
} from "@oigamez/dynamodb";

const getAllActiveGameCodes = async (): Promise<string[]> => {
  const input: GetItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.gameList,
  };
  const command = new GetItemCommand(input);
  const response = await dbClient.send(command);

  if (!response?.Item) {
    return [];
  }

  return getDynamoSet(response.Item[dynamoFieldNames.gameList.gameCodes]);
};

export default getAllActiveGameCodes;
