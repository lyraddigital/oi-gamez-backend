import { GameSessionStatuses } from "@oigamez/dynamodb";
import { GameSession } from "@oigamez/models";
import { RuleSetResult } from "@oigamez/rule-sets";

const runQuestionsRuleSet = (
  gameSession: GameSession | undefined
): RuleSetResult => {
  if (gameSession) {
    const questionIndex = gameSession.currentQuestionNumber - 1 ?? 0;
    const questionUpperIndex = gameSession.questions?.length - 1 ?? 0;
    const isLastQuestion = questionIndex == questionUpperIndex;

    if (!isLastQuestion) {
      return {
        isSuccessful: false,
        errorMessages: ["Cannot end game. You are not on the final question."],
      };
    }
  }

  return { isSuccessful: true };
};

export const runEndGameRuleSet = (gameSession: GameSession): RuleSetResult => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot end game. No game was found."],
    };
  } else if (gameSession.status !== GameSessionStatuses.inProgress) {
    return {
      isSuccessful: false,
      errorMessages: ["Cannot end game. The game is not in progress."],
    };
  } else if (gameSession.isAllowingSubmissions) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Cannot end game. The question is still taking submissions.",
      ],
    };
  }

  return runQuestionsRuleSet(gameSession);
};
