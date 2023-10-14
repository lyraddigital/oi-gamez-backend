export const mapToCommunicationQuestion = (question) => {
  return {
    text: question.text,
    options: question.options.map((op) => ({
      id: op.optionId,
      text: op.optionText,
    })),
  };
};
