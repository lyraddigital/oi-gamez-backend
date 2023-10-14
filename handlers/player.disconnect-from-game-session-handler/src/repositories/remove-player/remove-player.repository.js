import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  expressions,
  dynamoFieldNames,
  keys,
  numberAttribute,
} from "@oigamez/dynamodb";

export const removePlayerAndUpdateGameSession = async ({
  playerSessionId,
  hostSessionId,
}) => {
  const input = {
    TransactItems: [
      {
        Update: {
          TableName: DYNAMO_TABLE_NAME,
          UpdateExpression:
            "SET #currentNumberOfPlayers = #currentNumberOfPlayers - :decrement",
          Key: keys.gameSession(hostSessionId),
          ConditionExpression: expressions.common.keysExists,
          ExpressionAttributeNames: {
            "#currentNumberOfPlayers":
              dynamoFieldNames.gameSession.currentNumberOfPlayers,
          },
          ExpressionAttributeValues: {
            ":decrement": numberAttribute(1),
          },
        },
      },
      {
        Delete: {
          TableName: DYNAMO_TABLE_NAME,
          Key: keys.player(hostSessionId, playerSessionId),
          ConditionExpression: expressions.common.keysExists,
        },
      },
    ],
  };

  const command = new TransactWriteItemsCommand(input);

  await dbClient.send(command);
};
