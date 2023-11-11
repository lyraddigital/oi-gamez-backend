import {
  ConnectGameCommand,
  ConnectToGameCommand,
  GetAnswerCommand,
  JoinGameCommand,
  PlayGameCommand,
  RestCommandError,
  StartGameCommand,
} from "../../../shared/commands";
import { GameSessionStatuses } from "../../../shared/dynamodb";
import { GameSessionQuery } from "../../../shared/queries";
import { GameSessionStatusUpdater } from "../../../shared/updaters";

describe("Get Answer Handler", () => {
  it("On submission with no session id, returns correct errors", async () => {
    // Arrange
    const getAnswerCommand = new GetAnswerCommand();

    try {
      // Action
      await getAnswerCommand.execute(undefined);
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
    const getAnswerCommand = new GetAnswerCommand();

    try {
      // Action
      await getAnswerCommand.execute(notFoundSessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Could not find the game session that matches the passed in session id."
      );
    }
  });

  it("On submission but game is not active, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const getAnswerCommand = new GetAnswerCommand();
    const gameSessionStatusUpdater = new GameSessionStatusUpdater();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.notActive
      );

      await getAnswerCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Could not get the answer. The game is not in progress"
      );
    } finally {
      connectGameCommand.disconnect();
    }
  });

  it("On submission but game is not started, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const getAnswerCommand = new GetAnswerCommand();
    const gameSessionStatusUpdater = new GameSessionStatusUpdater();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.notStarted
      );

      await getAnswerCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Could not get the answer. The game is not in progress"
      );
    } finally {
      connectGameCommand.disconnect();
    }
  });

  it("On submission but game is completed, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const getAnswerCommand = new GetAnswerCommand();
    const gameSessionStatusUpdater = new GameSessionStatusUpdater();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.completed
      );

      await getAnswerCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Could not get the answer. The game is not in progress"
      );
    } finally {
      connectGameCommand.disconnect();
    }
  });

  it("On submission and current question is not set, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const getAnswerCommand = new GetAnswerCommand();
    const gameSessionStatusUpdater = new GameSessionStatusUpdater();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.inProgress
      );

      await getAnswerCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Could not get the answer. As we could not find the question number in order to get the answer"
      );
    } finally {
      connectGameCommand.disconnect();
    }
  });

  it("On submission and all data is ok, returns answer and all dynamo records are updated", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const startGameCommand = new StartGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const joinGameCommand = new JoinGameCommand();
    const connectUserOneCommand = new ConnectToGameCommand();
    const connectUserTwoCommand = new ConnectToGameCommand();
    const getAnswerCommand = new GetAnswerCommand();
    const gameSessionQuery = new GameSessionQuery();

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
      await startGameCommand.execute(sessionId);

      const { answer } = await getAnswerCommand.execute(sessionId);

      const gameSession = await gameSessionQuery.getData(sessionId);

      // Assert
      expect(answer).toBeDefined();
      expect(gameSession!.isAllowingSubmissions).toBe(false);
    } finally {
      connectGameCommand.disconnect();
      connectUserOneCommand.disconnect();
      connectUserTwoCommand.disconnect();
    }
  });
});
