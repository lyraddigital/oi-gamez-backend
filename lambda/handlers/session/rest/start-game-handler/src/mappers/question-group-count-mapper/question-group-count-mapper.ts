import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { dynamoFieldNames, getDynamoInt } from "@oigamez/dynamodb";

import { QuestionGroupCount } from "../../models";

export const mapFromDynamoToQuestionGroupCount = (
  dynamoRecord: Record<string, AttributeValue>
): QuestionGroupCount => {
  return {
    questionGroupCount: getDynamoInt(
      dynamoRecord[dynamoFieldNames.questionGroupCount.questionGroupCount]
    ),
  };
};
