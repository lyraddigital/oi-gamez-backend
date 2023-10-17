import { Question } from "../../models/index.js";

export const mapToCommunicationQuestion = (question: Question) => {
  return {
    text: question.text,
    options: question.options.map((op: any) => ({
      id: op.optionId,
      text: op.optionText,
    })),
  };
};
