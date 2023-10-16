import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  getDynamoList,
  getDynamoMap,
  getDynamoString,
} from "@oigamez/dynamodb";

import { Question } from "../../models/index.js";

export const getFirstQuestionAndCountFromDynamo = (
  dynamoQuestions: AttributeValue
): [Question, number] => {
  const firstDynamoQuestion = getDynamoMap(dynamoQuestions[0]);
  const dynamoQuestionCount = getDynamoList(dynamoQuestions).length;
  const firstQuestion: Question = {
    text: getDynamoString(firstDynamoQuestion.questionText),
    options: getDynamoList(firstDynamoQuestion.options).map(
      (o: AttributeValue.MMember) => {
        const opMap = getDynamoMap(o);

        return {
          optionText: getDynamoString(opMap.optionText),
          optionId: getDynamoString(opMap.optionId),
        };
      }
    ),
  };

  return [firstQuestion, dynamoQuestionCount];
};
