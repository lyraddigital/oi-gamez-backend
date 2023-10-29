import { Option, Question } from "@oigamez/models";

export const mapToCommunicationQuestion = (question: Question) => {
  return {
    text: question.text,
    options: question.options.map((op: Option) => ({
      id: op.optionId,
      text: op.optionText,
    })),
  };
};
