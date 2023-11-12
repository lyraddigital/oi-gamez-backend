import { GameSession, Player } from "@oigamez/models";

import { LeaderboardItem, PlayerScore } from "../../models";

const getPlayerScores = (
  gameSession: GameSession,
  players: Player[],
  answerKeys: number[]
) => {
  const playerScores: PlayerScore[] = [];

  if (players) {
    players.forEach((p) => {
      if (p?.username) {
        let score = 0;

        if (p?.choices) {
          answerKeys.forEach((ak) => {
            const choice = p.choices.get(ak);
            const answer = gameSession.answers.get(ak);

            if (choice && answer && choice === answer) {
              score++;
            }
          });
        }

        playerScores.push({ username: p.username, score });
      }
    });
  }

  return playerScores;
};

export const getLeaderboard = (
  gameSession: GameSession,
  players: Player[],
  answerKeys: number[]
): LeaderboardItem[] => {
  const playerScores = getPlayerScores(gameSession, players, answerKeys);
  const allScoresSorted = playerScores
    .sort((ps) => ps.score)
    .map((ps) => ps.score);
  const scorePositions = new Map<number, number>();
  let currentPosition = 0;

  allScoresSorted.forEach((s) => {
    currentPosition += 1;

    if (!scorePositions.get(s)) {
      scorePositions.set(s, currentPosition);
    }
  });

  return playerScores
    .map<LeaderboardItem>((ps) => {
      const position = scorePositions.get(ps.score) || 0;
      return { username: ps.username, score: ps.score, position };
    })
    .sort((li) => li.position);
};
