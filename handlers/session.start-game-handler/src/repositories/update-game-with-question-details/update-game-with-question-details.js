import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  booleanAttribute,
  dbClient,
  dynamoFieldNames,
  expressions,
  gameSessionStatuses,
  keys,
  numberAttribute,
  stringAttribute,
} from "@oigamez/dynamodb";

export const updateGameWithQuestionGroupDetails = async ({
  sessionId,
  questions,
  answers,
}) => {
  const input = {
    TableName: DYNAMO_TABLE_NAME,
    Key: keys.gameSession(sessionId),
    UpdateExpression: `
        SET #answers = :answers, #currentQuestionNumber = :currentQuestionNumber, 
        #isAllowingSubmissions = :isAllowingSubmissions, 
        #questions = :questions, #status = :status
    `,
    ConditionExpression: expressions.common.keysExists,
    ExpressionAttributeNames: {
      "#answers": dynamoFieldNames.gameSession.answers,
      "#currentQuestionNumber":
        dynamoFieldNames.gameSession.currentQuestionNumber,
      "#isAllowingSubmissions":
        dynamoFieldNames.gameSession.isAllowingSubmissions,
      "#questions": dynamoFieldNames.gameSession.questions,
      "#status": dynamoFieldNames.gameSession.status,
    },
    ExpressionAttributeValues: {
      ":answers": answers,
      ":currentQuestionNumber": numberAttribute(1),
      ":isAllowingSubmissions": booleanAttribute(true),
      ":questions": questions,
      ":status": stringAttribute(gameSessionStatuses.inProgress),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};
