import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  getDynamoList,
  getDynamoMap,
  getDynamoString,
} from "@oigamez/dynamodb";
import { Question } from "@oigamez/models";

export const mapQuestions = (
  questionsAttributeValue: AttributeValue
): Question[] => {
  return getDynamoList(questionsAttributeValue).map((questionMap) => {
    const dynamoQuestion = getDynamoMap(questionMap);

    return {
      text: getDynamoString(dynamoQuestion?.questionText),
      options: getDynamoList(dynamoQuestion?.options).map(
        (o: AttributeValue) => {
          const opMap = getDynamoMap(o);

          return {
            optionText: getDynamoString(opMap?.optionText),
            optionId: getDynamoString(opMap?.optionId),
          };
        }
      ),
    };
  });
};
