import { AttributeValue } from "@aws-sdk/client-dynamodb";

export interface GameSessionQuestionDetails {
  sessionId: string;
  questions: AttributeValue;
  answers: AttributeValue;
}
