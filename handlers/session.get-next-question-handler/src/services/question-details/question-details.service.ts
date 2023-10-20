import { GameSession } from "@oigamez/repositories";

export const getQuestionDetailsFromGameSession = (
  gameSession: GameSession
): [number, string | undefined] => {
  if (!gameSession.currentQuestionNumber) {
    throw new Error(
      "Could not find the current question number for the current game session."
    );
  }

  if (!gameSession.answers) {
    throw new Error("Could not find the answers for the current game session.");
  }

  const currentQuestionNumber = gameSession.currentQuestionNumber || 1;
  const answer = gameSession.answers.get(currentQuestionNumber);

  return [currentQuestionNumber, answer];
};
