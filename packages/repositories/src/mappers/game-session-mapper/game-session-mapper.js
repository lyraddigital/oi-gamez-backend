import {
  dynamoFieldNames,
  getDynamoInt,
  getDynamoString,
} from "@oigamez/dynamodb";

export const mapFromDynamoToGameSession = (dynamoRecord) => {
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
  };
};
