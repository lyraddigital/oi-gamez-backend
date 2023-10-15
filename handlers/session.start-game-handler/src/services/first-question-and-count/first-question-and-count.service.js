import {
  getDynamoList,
  getDynamoMap,
  getDynamoString,
} from "@oigamez/dynamodb";

export const getFirstQuestionAndCountFromDynamo = (dynamoQuestions) => {
  const dynamoQuestionList = getDynamoList(dynamoQuestions);
  const firstDynamoQuestion = getDynamoMap(dynamoQuestionList[0]);
  const dynamoQuestionCount = dynamoQuestionList.length;
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
