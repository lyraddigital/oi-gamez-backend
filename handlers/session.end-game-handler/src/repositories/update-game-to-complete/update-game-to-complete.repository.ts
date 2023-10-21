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
  GameSessionStatuses,
} from "@oigamez/dynamodb";

export const updateGameSessionToComplete = async (
  sessionId: string
): Promise<void> => {
  const input: UpdateItemCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.gameSession(sessionId),
    ConditionExpression: expressions.common.keysExists,
    UpdateExpression: "SET #status = :status",
    ExpressionAttributeNames: {
      "#status": dynamoFieldNames.gameSession.status,
    },
    ExpressionAttributeValues: {
      ":status": dynamoFieldValues.gameSession.status(
        GameSessionStatuses.completed
      ),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};
