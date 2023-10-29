import { GameSession, Player } from "@oigamez/models";

import { LeaderboardItem } from "../../models";
import { getLeaderboard } from "../get-leaderboard";

export const getFinalResult = (
  gameSession: GameSession,
  players: Player[]
): [LeaderboardItem[], string[]] => {
  if (!gameSession.answers) {
    return [[], []];
  }

  const answerKeys = [...gameSession.answers.keys()];
  const totalNumberOfAnswers = answerKeys.length;

  if (totalNumberOfAnswers == 0) {
    return [[], []];
  }

  const leaderboardItems = getLeaderboard(gameSession, players, answerKeys);
  const maxScore = Math.max(...leaderboardItems.map((li) => li.score));
  const winners = leaderboardItems
    .filter((li) => li.score === maxScore)
    .map((li) => li.username);

  return [leaderboardItems, winners];
};
