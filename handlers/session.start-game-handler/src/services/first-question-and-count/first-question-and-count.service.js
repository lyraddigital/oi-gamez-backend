import {
  getDynamoList,
  getDynamoMap,
  getDynamoString,
} from "@oigamez/dynamodb";

export const getFirstQuestionAndCountFromDynamo = (dynamoQuestions) => {
  const firstDynamoQuestion = getDynamoMap(getDynamoList(dynamoQuestions)[0]);
  const dynamoQuestionCount = dynamoQuestions.length;
  const firstQuestion = {
    text: getDynamoString(firstDynamoQuestion.questionText),
    options: getDynamoList(firstDynamoQuestion.options).map((o) => {
      const opMap = getDynamoMap(o);

      return {
        optionText: getDynamoString(opMap.optionText),
        optionId: getDynamoString(opMap.optionId),
      };
    }),
  };

  return [firstQuestion, dynamoQuestionCount];
};
