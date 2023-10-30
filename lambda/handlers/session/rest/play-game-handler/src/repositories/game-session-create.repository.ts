import {
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration/dynamo-table-name";
import {
  dbClient,
  expressions,
  dynamoFieldNames,
  dynamoFieldValues,
  GameSessionStatuses,
  keys,
} from "@oigamez/dynamodb";

import { GameSessionToCreate } from "../models";

const createGameSession = async ({
  gameCode,
  maxPlayers,
  minPlayers,
  sessionId,
  ttl,
}: GameSessionToCreate): Promise<void> => {
  const input: TransactWriteItemsCommandInput = {
    TransactItems: [
      {
        Put: {
          TableName: DYNAMO_TABLE_NAME,
          Item: {
            [dynamoFieldNames.common.pk]:
              dynamoFieldValues.gameSession.pk(sessionId),
            [dynamoFieldNames.common.sk]: dynamoFieldValues.gameSession.sk,
            [dynamoFieldNames.common.type]: dynamoFieldValues.gameSession.type,
            [dynamoFieldNames.gameSession.status]:
              dynamoFieldValues.gameSession.status(
                GameSessionStatuses.notActive
              ),
            [dynamoFieldNames.gameSession.currentNumberOfPlayers]:
              dynamoFieldValues.gameSession.currentNumberOfPlayers(0),
            [dynamoFieldNames.gameSession.sessionId]:
              dynamoFieldValues.gameSession.sessionId(sessionId),
            [dynamoFieldNames.gameSession.gameCode]:
              dynamoFieldValues.gameSession.gameCode(gameCode),
            [dynamoFieldNames.gameSession.minPlayers]:
              dynamoFieldValues.gameSession.minPlayers(minPlayers),
            [dynamoFieldNames.gameSession.maxPlayers]:
              dynamoFieldValues.gameSession.maxPlayers(maxPlayers),
            [dynamoFieldNames.common.ttl]:
              dynamoFieldValues.gameSession.ttl(ttl),
          },
        },
      },
      {
        Update: {
          TableName: DYNAMO_TABLE_NAME,
          UpdateExpression: "ADD #gameCodes :gameCode",
          Key: keys.gameList,
          ConditionExpression: expressions.common.keysExists,
          ExpressionAttributeNames: {
            "#gameCodes": dynamoFieldNames.gameList.gameCodes,
          },
          ExpressionAttributeValues: {
            ":gameCode": dynamoFieldValues.gameList.gameCodes([gameCode]),
          },
        },
      },
    ],
  };

  const command = new TransactWriteItemsCommand(input);

  await dbClient.send(command);
};
export default createGameSession;
