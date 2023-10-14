import { dynamoFieldNames, getDynamoString } from "@oigamez/dynamodb";

export const mapFromDynamoToPlayer = (dynamoRecord) => {
  return {
    username: getDynamoString(dynamoRecord[dynamoFieldNames.player.username]),
    hostSessionId: getDynamoString(
      dynamoRecord[dynamoFieldNames.player.hostSessionId]
    ),
    connectionId: getDynamoString(
      dynamoRecord[dynamoFieldNames.player.connectionId]
    ),
    sessionId: getDynamoString(dynamoRecord[dynamoFieldNames.player.sessionId]),
  };
};
