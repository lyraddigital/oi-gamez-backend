import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  getDynamoList,
  getDynamoMap,
  getDynamoString,
} from "@oigamez/dynamodb";

import { Question } from "../../models";

export const getFirstQuestionAndCountFromDynamo = (
  dynamoQuestions: AttributeValue
): [Question, number] => {
  const dynamoQuestionList = getDynamoList(dynamoQuestions);
  const firstDynamoQuestion = getDynamoMap(dynamoQuestionList[0]);
  const dynamoQuestionCount = dynamoQuestionList.length;
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
