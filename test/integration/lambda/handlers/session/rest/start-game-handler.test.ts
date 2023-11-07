import {
  ConnectGameCommand,
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

  it("On submission but not enough players have joined, returns correct errors", async () => {
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
});
