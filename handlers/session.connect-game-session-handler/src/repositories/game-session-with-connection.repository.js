import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  dbClient,
  expressions,
  dynamoFieldNames,
  dynamofieldValues,
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
      "#connectionId": dynamoFieldNames.gameSession.connectionId,
      "#status": dynamoFieldNames.gameSession.status,
      "#ttl": dynamoFieldNames.common.ttl,
    },
    ExpressionAttributeValues: {
      ":connectionId": dynamofieldValues.gameSession.connectionId(
        updatedGameSession.connectionId
      ),
      ":status": dynamofieldValues.gameSession.status(
        updatedGameSession.status
      ),
      ":ttl": dynamofieldValues.gameSession.ttl(updatedGameSession.ttl),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};

export default updateGameSessionWithConnectionDetails;
