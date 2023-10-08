import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  expressions,
  fieldNames,
  fieldValues,
  keys,
} from "@oigamez/dynamodb";

const updateGameSessionWithConnectionDetails = async (updatedGameSession) => {
  const input = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.gameSession(updatedGameSession.sessionId),
    ConditionExpression: expressions.common.keysExists,
    UpdateExpression:
      "SET #connectionId = :connectionId, #status = :status, #ttl = :ttl",
    ExpressionAttributeNames: {
      "#connectionId": fieldNames.gameSession.connectionId,
      "#status": fieldNames.gameSession.status,
      "#ttl": fieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":connectionId": fieldValues.gameSession.connectionId(
        updatedGameSession.connectionId
      ),
      ":status": fieldValues.gameSession.status(updatedGameSession.status),
      ":ttl": fieldValues.gameSession.ttl(updatedGameSession.ttl),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};

export default updateGameSessionWithConnectionDetails;
