import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import { dbClient, fieldNames, keys } from "@oigamez/dynamodb";

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

  return response.Item[fieldNames.gameList.gameCodes]?.SS || [];
};

export default getAllActiveGameCodes;
