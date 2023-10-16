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
  numberAttribute,
  stringAttribute,
} from "@oigamez/dynamodb";

import { UpdatePlayerAndGameSession } from "../../models/update-player-and-game-session.js";

export const updatePlayerAndGameSession = async ({
  playerSessionId,
  hostSessionId,
  connectionId,
  gameSessionTTL,
}: UpdatePlayerAndGameSession) => {
  const input: TransactWriteItemsCommandInput = {
    TransactItems: [
      {
        Update: {
          TableName: DYNAMO_TABLE_NAME,
          UpdateExpression:
            "SET #currentNumberOfPlayers = #currentNumberOfPlayers + :increment",
          Key: keys.gameSession(hostSessionId),
          ConditionExpression: `${expressions.common.keysExists} AND #currentNumberOfPlayers < #maxPlayers AND #status = :status`,
          ExpressionAttributeNames: {
            "#currentNumberOfPlayers":
              dynamoFieldNames.gameSession.currentNumberOfPlayers,
            "#maxPlayers": dynamoFieldNames.gameSession.maxPlayers,
            "#status": dynamoFieldNames.gameSession.status,
          },
          ExpressionAttributeValues: {
            ":increment": numberAttribute(1),
            ":status": stringAttribute(GameSessionStatuses.notStarted),
          },
        },
      },
      {
        Update: {
          TableName: DYNAMO_TABLE_NAME,
          UpdateExpression: "SET #ttl = :updateTtl, #connId = :connId",
          Key: keys.player(hostSessionId, playerSessionId),
          ConditionExpression: expressions.common.keysExists,
          ExpressionAttributeNames: {
            "#ttl": dynamoFieldNames.common.ttl,
            "#connId": dynamoFieldNames.player.connectionId,
          },
          ExpressionAttributeValues: {
            ":updateTtl": dynamoFieldValues.player.ttl(gameSessionTTL),
            ":connId": dynamoFieldValues.player.connectionId(connectionId),
          },
        },
      },
    ],
  };

  const command = new TransactWriteItemsCommand(input);

  await dbClient.send(command);
};
