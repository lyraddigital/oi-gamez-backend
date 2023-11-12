import { Question } from "../../models";

export interface GetNextQuestionResponse {
  currentQuestionNumber: number;
  question: Question;
}
