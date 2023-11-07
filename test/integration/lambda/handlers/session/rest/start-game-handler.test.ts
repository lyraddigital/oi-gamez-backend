import {
  ConnectGameCommand,
  ConnectToGameCommand,
  JoinGameCommand,
  PlayGameCommand,
  RestCommandError,
  StartGameCommand,
} from "../../../shared/commands";
import { GameSessionStatuses } from "../../../shared/dynamodb";
import { GameSessionStatusUpdater } from "../../../shared/updaters";

describe("Start Game Handler", () => {
  it("On submission with no session id, returns correct errors", async () => {
    // Arrange
    const startGameCommand = new StartGameCommand();

    try {
      // Action
      await startGameCommand.execute(undefined);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Session id could not be found. Make sure you've sent it"
      );
    }
  });

  it("On submission with a session id but no game is found, returns correct errors", async () => {
    // Arrange
    const notFoundSessionId = "notFoundSessionId";
    const startGameCommand = new StartGameCommand();

    try {
      // Action
      await startGameCommand.execute(notFoundSessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot start game. No game was found."
      );
    }
  });

  it("On submission but game is in progress, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const startGameCommand = new StartGameCommand();
    const gameSessionStatusUpdater = new GameSessionStatusUpdater();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.inProgress
      );

      await startGameCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot start game. The game has already started."
      );
    }
  });

  it("On submission but game is completed, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const startGameCommand = new StartGameCommand();
    const gameSessionStatusUpdater = new GameSessionStatusUpdater();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.completed
      );

      await startGameCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot start game. The game is over."
      );
    }
  });

  it("On submission and enough players have joined, returns correct data and correct data in dynamodb", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const startGameCommand = new StartGameCommand();
    const connectGameCommand = new ConnectGameCommand();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);

      await startGameCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot start game. Not enough players have joined."
      );
    } finally {
      connectGameCommand.disconnect();
    }
  });

  it("On submission but not enough players have joined, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const startGameCommand = new StartGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const joinGameCommand = new JoinGameCommand();
    const connectUserOneCommand = new ConnectToGameCommand();
    const connectUserTwoCommand = new ConnectToGameCommand();

    try {
      // Action
      const { sessionId, gameCode } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      const { sessionId: firstPlayerSessionId } = await joinGameCommand.execute(
        gameCode,
        { username: "AA" }
      );
      await connectUserOneCommand.connect(firstPlayerSessionId);
      const { sessionId: secondPlayerSessionId } =
        await joinGameCommand.execute(gameCode, { username: "AB" });
      await connectUserTwoCommand.connect(secondPlayerSessionId);

      const response = await startGameCommand.execute(sessionId);

      // Assert
      expect(response).toBeDefined();
      expect(response.currentQuestionNumber).toBe(1);
      expect(response.totalNumberOfQuestions).toBeGreaterThan(0);
      expect(response.question).toBeDefined();
      expect(response.question.text).toBeDefined();
      expect(response.question.options).toBeDefined();

      response.question.options.forEach((o) => {
        expect(o.optionId).toBeDefined();
        expect(o.optionText).toBeDefined();
      });
    } finally {
      connectGameCommand.disconnect();
      connectUserOneCommand.disconnect();
      connectUserTwoCommand.disconnect();
    }
  });
});
