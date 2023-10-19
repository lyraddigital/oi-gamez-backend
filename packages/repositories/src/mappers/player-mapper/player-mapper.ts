import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  dynamoFieldNames,
  getDynamoString,
  getDynamoMap,
} from "@oigamez/dynamodb";

import { Player } from "../../models";

const convertToChoiceMap = (
  dynamoMap: Record<string, AttributeValue>
): Map<number, string> => {
  const choiceMap: Map<number, string> = new Map<number, string>();

  Object.keys(dynamoMap).forEach((questionNumber: string) => {
    choiceMap.set(parseInt(questionNumber, 10), dynamoMap[questionNumber].S);
  });

  return choiceMap;
};

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
    choices: convertToChoiceMap(
      getDynamoMap(dynamoRecord[dynamoFieldNames.player.choices])
    ),
    sessionId: getDynamoString(dynamoRecord[dynamoFieldNames.player.sessionId]),
  };
};
