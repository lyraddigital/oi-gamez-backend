import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  dynamoFieldNames,
  getDynamoString,
  getDynamoMap,
  getOptionalDynamoString,
} from "@oigamez/dynamodb";
import { Player } from "@oigamez/models";

import { convertDynamoMapToMapMapper } from "../dynamo-map-to-map-mapper";

export const mapFromDynamoToPlayer = (
  dynamoRecord: Record<string, AttributeValue>
): Player => {
  return {
    username: getDynamoString(dynamoRecord[dynamoFieldNames.player.username]),
    hostSessionId: getDynamoString(
      dynamoRecord[dynamoFieldNames.player.hostSessionId]
    ),
    connectionId: getOptionalDynamoString(
      dynamoRecord[dynamoFieldNames.player.connectionId]
    ),
    choices: convertDynamoMapToMapMapper(
      getDynamoMap(dynamoRecord[dynamoFieldNames.player.choices])
    ),
    sessionId: getDynamoString(dynamoRecord[dynamoFieldNames.player.sessionId]),
  };
};
