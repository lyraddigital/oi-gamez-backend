import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  expressions,
  dynamoFieldNames,
  dynamoFieldValues,
  keys,
} from "@oigamez/dynamodb";

import { UpdatedGameSession } from "../models/updated-game-session.js";

const updateGameSessionWithConnectionDetails = async (
  updatedGameSession: UpdatedGameSession
) => {
  const input: UpdateItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.gameSession(updatedGameSession.sessionId),
    ConditionExpression: expressions.common.keysExists,
    UpdateExpression:
      "SET #connectionId = :connectionId, #status = :status, #ttl = :ttl",
    ExpressionAttributeNames: {
      "#connectionId": dynamoFieldNames.gameSession.connectionId,
      "#status": dynamoFieldNames.gameSession.status,
      "#ttl": dynamoFieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":connectionId": dynamoFieldValues.gameSession.connectionId(
        updatedGameSession.connectionId
      ),
      ":status": dynamoFieldValues.gameSession.status(
        updatedGameSession.status
      ),
      ":ttl": dynamoFieldValues.gameSession.ttl(updatedGameSession.ttl),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};

export default updateGameSessionWithConnectionDetails;
