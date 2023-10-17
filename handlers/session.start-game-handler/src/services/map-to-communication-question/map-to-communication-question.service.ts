import { Option, Question } from "../../models";

export const mapToCommunicationQuestion = (question: Question) => {
  return {
    text: question.text,
    options: question.options.map((op: Option) => ({
      id: op.optionId,
      text: op.optionText,
    })),
  };
};
