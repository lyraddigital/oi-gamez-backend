import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  dynamoFieldNames,
  getDynamoInt,
  getDynamoString,
  getOptionalDynamoBoolean,
  getDynamoMap,
  getOptionalDynamoString,
  getOptionalDynamoInt,
} from "../dynamodb";

import { convertDynamoMapToMapMapper } from "./dynamo-map-to-map-mapper";
import { mapQuestions } from "./questions-mapper";
import { GameSession } from "../models";

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
    currentQuestionNumber: getOptionalDynamoInt(
      dynamoRecord[dynamoFieldNames.gameSession.currentQuestionNumber]
    ),
    connectionId: getOptionalDynamoString(
      dynamoRecord[dynamoFieldNames.gameSession.connectionId]
    ),
    gameCode: getDynamoString(
      dynamoRecord[dynamoFieldNames.gameSession.gameCode]
    ),
    isAllowingSubmissions: getOptionalDynamoBoolean(
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
