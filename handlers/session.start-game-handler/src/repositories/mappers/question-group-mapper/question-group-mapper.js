import {
  getDynamoMap,
  getDynamoList,
  getDynamoString,
} from "@oigamez/dynamodb";

export const mapFromDynamoToQuestionGroup = (dynamoRecord) => {
  const answerMap = getDynamoMap(dynamoRecord.Answers);
  const questionList = getDynamoList(dynamoRecord.Questions);
  let convertedAnswers = {};

  Object.keys(answerMap).forEach((aNum) => {
    convertedAnswers = {
      ...convertedAnswers,
      [aNum]: getDynamoString(answerMap[aNum]),
    };
  });

  console.log(questionList.map((q) => getDynamoMap(q)));

  return {
    questions: {},
    answers: convertedAnswers,
  };
};
