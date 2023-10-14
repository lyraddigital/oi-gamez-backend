import { dynamoFieldNames, getDynamoInt } from "@oigamez/dynamodb";

export const mapFromDynamoToQuestionGroupCount = (dynamoRecord) => {
  return {
    questionGroupCount: getDynamoInt(
      dynamoRecord[dynamoFieldNames.questionGroupCount.questionGroupCount]
    ),
  };
};
