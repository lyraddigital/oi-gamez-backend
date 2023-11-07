import { Question } from "../../models";

export interface StartGameCommandResponse {
  currentQuestionNumber: number;
  totalNumberOfQuestions: number;
  question: Question;
}
