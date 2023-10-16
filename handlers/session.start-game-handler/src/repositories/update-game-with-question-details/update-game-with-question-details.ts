import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import {
  booleanAttribute,
  dbClient,
  dynamoFieldNames,
  expressions,
  GameSessionStatuses,
  keys,
  numberAttribute,
  stringAttribute,
} from "@oigamez/dynamodb";

import { GameSessionQuestionDetails } from "../../models/index.js";

export const updateGameWithQuestionGroupDetails = async ({
  sessionId,
  questions,
  answers,
}: GameSessionQuestionDetails): Promise<void> => {
  const input: UpdateItemCommandInput = {
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
      ":status": stringAttribute(GameSessionStatuses.inProgress),
    },
  };

  const command = new UpdateItemCommand(input);

  await dbClient.send(command);
};
