import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { mapQuestions } from "@oigamez/mappers/dynamo/questions-mapper";
import { Question } from "@oigamez/models";

export const getFirstQuestionAndCountFromDynamo = (
  dynamoQuestions: AttributeValue
): [Question, number] => {
  const questionList = mapQuestions(dynamoQuestions);
  const firstQuestion = questionList[0];
  const dynamoQuestionCount = questionList.length;

  return [firstQuestion, dynamoQuestionCount];
};
