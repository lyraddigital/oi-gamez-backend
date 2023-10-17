import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { dynamoFieldNames, getDynamoString } from "@oigamez/dynamodb";

import { Player } from "../../models";

export const mapFromDynamoToPlayer = (
  dynamoRecord: Record<string, AttributeValue>
): Player => {
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
