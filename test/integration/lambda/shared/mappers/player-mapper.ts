import { AttributeValue } from "@aws-sdk/client-dynamodb";

import { Player } from "../models";
import {
  dynamoFieldNames,
  getDynamoInt,
  getDynamoMap,
  getDynamoString,
  getOptionalDynamoString,
} from "../dynamodb";

const getChoicesMap = (
  choicesAttribute?: AttributeValue
): Map<number, string> => {
  const map = new Map<number, string>();

  if (choicesAttribute) {
    const recordMap = getDynamoMap(choicesAttribute);
    // Later we'll fix this to get all the choices when entered
  }

  return map;
};

export const mapFromDynamoToPlayer = (
  dynamoRecord: Record<string, AttributeValue>
): Player => {
  return {
    hostSessionId: getDynamoString(
      dynamoRecord[dynamoFieldNames.player.hostSessionId]
    ),
    sessionId: getDynamoString(dynamoRecord[dynamoFieldNames.player.sessionId]),
    connectionId: getOptionalDynamoString(
      dynamoRecord[dynamoFieldNames.player.connectionId]
    ),
    username: getDynamoString(dynamoRecord[dynamoFieldNames.player.username]),
    choices: getChoicesMap(dynamoRecord[dynamoFieldNames.player.choices]),
    ttl: getDynamoInt(dynamoRecord[dynamoFieldNames.common.ttl]),
  };
};
