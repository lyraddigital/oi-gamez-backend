import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  expressions,
  fieldNames,
  fieldValues,
  gameSessionStatuses,
  keys,
} from "@oigamez/dynamodb";

const createGameSession = async (gameSessionToCreate) => {
  try {
    const input = {
      TransactItems: [
        {
          Put: {
            TableName: DYNAMO_TABLE_NAME,
            Item: {
              [fieldNames.common.pk]: fieldValues.gameSession.pk(
                gameSessionToCreate.sessionId
              ),
              [fieldNames.common.sk]: fieldValues.gameSession.sk,
              [fieldNames.common.type]: fieldValues.gameSession.type,
              [fieldNames.gameSession.status]: fieldValues.gameSession.status(
                gameSessionStatuses.notActive
              ),
              [fieldNames.gameSession.currentNumberOfPlayers]:
                fieldValues.gameSession.currentNumberOfPlayers(0),
              [fieldNames.gameSession.sessionId]:
                fieldValues.gameSession.sessionId(
                  gameSessionToCreate.sessionId
                ),
              [fieldNames.gameSession.gameCode]:
                fieldValues.gameSession.gameCode(gameSessionToCreate.gameCode),
              [fieldNames.gameSession.minPlayers]:
                fieldValues.gameSession.minPlayers(
                  gameSessionToCreate.minPlayers
                ),
              [fieldNames.gameSession.maxPlayers]:
                fieldValues.gameSession.maxPlayers(
                  gameSessionToCreate.maxPlayers
                ),
              [fieldNames.common.ttl]: fieldValues.gameSession.ttl(
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
              "#gameCodes": fieldNames.gameList.gameCodes,
            },
            ExpressionAttributeValues: {
              ":gameCode": fieldValues.gameList.gameCodes([
                gameSessionToCreate.gameCode,
              ]),
            },
          },
        },
      ],
    };

    const command = new TransactWriteItemsCommand(input);

    await dbClient.send(command);
  } catch (e) {
    // We will log this cloudwatch later.
    console.log(e);
  }
};
export default createGameSession;
