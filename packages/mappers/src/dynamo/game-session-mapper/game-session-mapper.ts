import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  dynamoFieldNames,
  getDynamoInt,
  getDynamoString,
  getDynamoBoolean,
  getDynamoMap,
} from "@oigamez/dynamodb";
import { GameSession } from "@oigamez/models";

import { convertDynamoMapToMapMapper } from "../dynamo-map-to-map-mapper";
import { mapQuestions } from "../questions-mapper";

export const mapFromDynamoToGameSession = (
  dynamoRecord: Record<string, AttributeValue>
): GameSession => {
  return {
    answers: convertDynamoMapToMapMapper(
      getDynamoMap(dynamoRecord[dynamoFieldNames.gameSession.answers])
    ),
    sessionId: getDynamoString(
      dynamoRecord[dynamoFieldNames.gameSession.sessionId]
    ),
    status: getDynamoString(dynamoRecord[dynamoFieldNames.gameSession.status]),
    currentNumberOfPlayers: getDynamoInt(
      dynamoRecord[dynamoFieldNames.gameSession.currentNumberOfPlayers]
    ),
    currentQuestionNumber: getDynamoInt(
      dynamoRecord[dynamoFieldNames.gameSession.currentQuestionNumber]
    ),
    connectionId: getDynamoString(
      dynamoRecord[dynamoFieldNames.gameSession.connectionId]
    ),
    gameCode: getDynamoString(
      dynamoRecord[dynamoFieldNames.gameSession.gameCode]
    ),
    isAllowingSubmissions: getDynamoBoolean(
      dynamoRecord[dynamoFieldNames.gameSession.isAllowingSubmissions]
    ),
    minPlayers: getDynamoInt(
      dynamoRecord[dynamoFieldNames.gameSession.minPlayers]
    ),
    maxPlayers: getDynamoInt(
      dynamoRecord[dynamoFieldNames.gameSession.maxPlayers]
    ),
    questions: mapQuestions(
      dynamoRecord[dynamoFieldNames.gameSession.questions]
    ),
    ttl: getDynamoInt(dynamoRecord[dynamoFieldNames.common.ttl]),
  };
};
