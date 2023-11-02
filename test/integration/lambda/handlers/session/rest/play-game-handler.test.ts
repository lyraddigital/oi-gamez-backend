import { GameSessionStatuses } from "../../../shared/dynamodb";
import { PlayGameCommand } from "../../../shared/commands";
import { GameSessionAndListQuery } from "../../../shared/queries";

describe("Play Game Handler", () => {
  test("On submission returns a new session id and game code", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();

    // Action
    const response = await playGameCommand.execute();

    // Assert
    expect(response).toBeDefined();
    expect(response.sessionId).toBeDefined();
    expect(response.gameCode).toBeDefined();
  });

  test("On submission creates / updates the correct records in the database", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const query = new GameSessionAndListQuery();

    // Action
    const response = await playGameCommand.execute();
    const { sessionId, gameCode } = response;

    const gameSessionAndList = await query.getData(sessionId);

    expect(gameSessionAndList.gameList).toBeDefined();
    expect(gameSessionAndList.gameSession).toBeDefined();
    expect(gameSessionAndList.gameList!.gameCodes).toBeDefined();
    expect(gameSessionAndList.gameList!.gameCodes!).toContain(gameCode);
    expect(gameSessionAndList.gameSession!.answers).toBeDefined();
    expect(gameSessionAndList.gameSession!.answers.size).toBe(0);
    expect(gameSessionAndList.gameSession!.sessionId).toBe(sessionId);
    expect(gameSessionAndList.gameSession!.status).toBe(
      GameSessionStatuses.notActive
    );
    expect(gameSessionAndList.gameSession!.currentNumberOfPlayers).toBe(0);
    expect(
      gameSessionAndList.gameSession!.currentQuestionNumber
    ).toBeUndefined();
    expect(gameSessionAndList.gameSession!.connectionId).toBeUndefined();
    expect(gameSessionAndList.gameSession!.gameCode).toBe(gameCode);
    expect(
      gameSessionAndList.gameSession!.isAllowingSubmissions
    ).toBeUndefined();
    expect(gameSessionAndList.gameSession!.minPlayers).toBe(2);
    expect(gameSessionAndList.gameSession!.maxPlayers).toBe(8);
    expect(gameSessionAndList.gameSession!.questions).toHaveLength(0);
    expect(gameSessionAndList.gameSession!.ttl).toBeDefined();
  });
});
