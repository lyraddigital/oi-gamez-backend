import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  dynamoFieldNames,
  getDynamoInt,
  getDynamoString,
} from "@oigamez/dynamodb";

import { GameSession } from "../../models/index.js";

export const mapFromDynamoToGameSession = (
  dynamoRecord: Record<string, AttributeValue>
): GameSession => {
  return {
    sessionId: getDynamoString(
      dynamoRecord[dynamoFieldNames.gameSession.sessionId]
    ),
    status: getDynamoString(dynamoRecord[dynamoFieldNames.gameSession.status]),
    currentNumberOfPlayers: getDynamoInt(
      dynamoRecord[dynamoFieldNames.gameSession.currentNumberOfPlayers]
    ),
    connectionId: getDynamoString(
      dynamoRecord[dynamoFieldNames.gameSession.connectionId]
    ),
    gameCode: getDynamoString(
      dynamoRecord[dynamoFieldNames.gameSession.gameCode]
    ),
    minPlayers: getDynamoInt(
      dynamoRecord[dynamoFieldNames.gameSession.minPlayers]
    ),
    maxPlayers: getDynamoInt(
      dynamoRecord[dynamoFieldNames.gameSession.maxPlayers]
    ),
    ttl: getDynamoInt(dynamoRecord[dynamoFieldNames.common.ttl]),
  };
};
