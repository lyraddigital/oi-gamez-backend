import {
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  expressions,
  dynamoFieldNames,
  dynamoFieldValues,
  GameSessionStatuses,
  keys,
} from "@oigamez/dynamodb";

const createGameSession = async (gameSessionToCreate): Promise<void> => {
  const input: TransactWriteItemsCommandInput = {
    TransactItems: [
      {
        Put: {
          TableName: DYNAMO_TABLE_NAME,
          Item: {
            [dynamoFieldNames.common.pk]: dynamoFieldValues.gameSession.pk(
              gameSessionToCreate.sessionId
            ),
            [dynamoFieldNames.common.sk]: dynamoFieldValues.gameSession.sk,
            [dynamoFieldNames.common.type]: dynamoFieldValues.gameSession.type,
            [dynamoFieldNames.gameSession.status]:
              dynamoFieldValues.gameSession.status(
                GameSessionStatuses.notActive
              ),
            [dynamoFieldNames.gameSession.currentNumberOfPlayers]:
              dynamoFieldValues.gameSession.currentNumberOfPlayers(0),
            [dynamoFieldNames.gameSession.sessionId]:
              dynamoFieldValues.gameSession.sessionId(
                gameSessionToCreate.sessionId
              ),
            [dynamoFieldNames.gameSession.gameCode]:
              dynamoFieldValues.gameSession.gameCode(
                gameSessionToCreate.gameCode
              ),
            [dynamoFieldNames.gameSession.minPlayers]:
              dynamoFieldValues.gameSession.minPlayers(
                gameSessionToCreate.minPlayers
              ),
            [dynamoFieldNames.gameSession.maxPlayers]:
              dynamoFieldValues.gameSession.maxPlayers(
                gameSessionToCreate.maxPlayers
              ),
            [dynamoFieldNames.common.ttl]: dynamoFieldValues.gameSession.ttl(
              gameSessionToCreate.ttl
            ),
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
            ":gameCode": dynamoFieldValues.gameList.gameCodes([
              gameSessionToCreate.gameCode,
            ]),
          },
        },
      },
    ],
  };

  const command = new TransactWriteItemsCommand(input);

  await dbClient.send(command);
};
export default createGameSession;
