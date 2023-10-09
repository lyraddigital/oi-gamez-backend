import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  expressions,
  dynamoFieldNames,
  dynamofieldValues,
  gameSessionStatuses,
  keys,
} from "@oigamez/dynamodb";

const createGameSession = async (gameSessionToCreate) => {
  const input = {
    TransactItems: [
      {
        Put: {
          TableName: DYNAMO_TABLE_NAME,
          Item: {
            [dynamoFieldNames.common.pk]: dynamofieldValues.gameSession.pk(
              gameSessionToCreate.sessionId
            ),
            [dynamoFieldNames.common.sk]: dynamofieldValues.gameSession.sk,
            [dynamoFieldNames.common.type]: dynamofieldValues.gameSession.type,
            [dynamoFieldNames.gameSession.status]:
              dynamofieldValues.gameSession.status(
                gameSessionStatuses.notActive
              ),
            [dynamoFieldNames.gameSession.currentNumberOfPlayers]:
              dynamofieldValues.gameSession.currentNumberOfPlayers(0),
            [dynamoFieldNames.gameSession.sessionId]:
              dynamofieldValues.gameSession.sessionId(
                gameSessionToCreate.sessionId
              ),
            [dynamoFieldNames.gameSession.gameCode]:
              dynamofieldValues.gameSession.gameCode(
                gameSessionToCreate.gameCode
              ),
            [dynamoFieldNames.gameSession.minPlayers]:
              dynamofieldValues.gameSession.minPlayers(
                gameSessionToCreate.minPlayers
              ),
            [dynamoFieldNames.gameSession.maxPlayers]:
              dynamofieldValues.gameSession.maxPlayers(
                gameSessionToCreate.maxPlayers
              ),
            [dynamoFieldNames.common.ttl]: dynamofieldValues.gameSession.ttl(
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
            ":gameCode": dynamofieldValues.gameList.gameCodes([
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
