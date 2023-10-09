import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  dynamoFieldNames,
  getListOfString,
  keys,
} from "@oigamez/dynamodb";

const getAllActiveGameCodes = async () => {
  const input = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.gameList,
  };
  const command = new GetItemCommand(input);
  const response = await dbClient.send(command);

  if (!response?.Item) {
    return [];
  }

  return getListOfString(response.Item[dynamoFieldNames.gameList.gameCodes]);
};

export default getAllActiveGameCodes;
