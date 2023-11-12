import {
  ConnectGameCommand,
  ConnectToGameCommand,
  GetAnswerCommand,
  GetNextQuestionCommand,
  JoinGameCommand,
  PlayGameCommand,
  RestCommandError,
  StartGameCommand,
} from "../../../shared/commands";
import { GameSessionStatuses } from "../../../shared/dynamodb";
import {
  CurrentQuestionNumberUpdater,
  GameSessionStatusUpdater,
  QuestionsUpdater,
} from "../../../shared/updaters";

describe("Get Next Question Handler", () => {
  it("On submission with no session id, returns correct errors", async () => {
    // Arrange
    const getNextQuestionCommand = new GetNextQuestionCommand();

    try {
      // Action
      await getNextQuestionCommand.execute(undefined);
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
    const getNextQuestionCommand = new GetNextQuestionCommand();

    try {
      // Action
      await getNextQuestionCommand.execute(notFoundSessionId);
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
    const getNextQuestionCommand = new GetNextQuestionCommand();
    const gameSessionStatusUpdater = new GameSessionStatusUpdater();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.notActive
      );

      await getNextQuestionCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot get next question. The game session is not in progress."
      );
    } finally {
      connectGameCommand.disconnect();
    }
  });

  it("On submission but game is not started, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const getNextQuestionCommand = new GetNextQuestionCommand();
    const gameSessionStatusUpdater = new GameSessionStatusUpdater();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.notStarted
      );

      await getNextQuestionCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot get next question. The game session is not in progress."
      );
    } finally {
      connectGameCommand.disconnect();
    }
  });

  it("On submission but game is completed, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const getNextQuestionCommand = new GetNextQuestionCommand();
    const gameSessionStatusUpdater = new GameSessionStatusUpdater();

    try {
      // Action
      const { sessionId } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.completed
      );

      await getNextQuestionCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot get next question. The game session is not in progress."
      );
    } finally {
      connectGameCommand.disconnect();
    }
  });

  it("On submission but game isAllowSubmissions is true, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const joinGameCommand = new JoinGameCommand();
    const connectUserOneCommand = new ConnectToGameCommand();
    const connectUserTwoCommand = new ConnectToGameCommand();
    const getNextQuestionCommand = new GetNextQuestionCommand();
    const startGameCommand = new StartGameCommand();

    try {
      // Action
      const { sessionId, gameCode } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      const { sessionId: playerOneSessionId } = await joinGameCommand.execute(
        gameCode,
        { username: "AA" }
      );
      await connectUserOneCommand.connect(playerOneSessionId);
      const { sessionId: playerTwoSessionId } = await joinGameCommand.execute(
        gameCode,
        { username: "AB" }
      );
      await connectUserTwoCommand.connect(playerTwoSessionId);
      await startGameCommand.execute(sessionId);

      await getNextQuestionCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot get next question. The current question has not closed off submissions."
      );
    } finally {
      connectGameCommand.disconnect();
      connectUserOneCommand.disconnect();
      connectUserTwoCommand.disconnect();
    }
  });

  it("On submission and current question is not set, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const joinGameCommand = new JoinGameCommand();
    const connectUserOneCommand = new ConnectToGameCommand();
    const connectUserTwoCommand = new ConnectToGameCommand();
    const getNextQuestionCommand = new GetNextQuestionCommand();
    const startGameCommand = new StartGameCommand();
    const getAnswerCommand = new GetAnswerCommand();
    const currentQuestionNumberUpdater = new CurrentQuestionNumberUpdater();

    try {
      // Action
      const { sessionId, gameCode } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      const { sessionId: playerOneSessionId } = await joinGameCommand.execute(
        gameCode,
        { username: "AA" }
      );
      await connectUserOneCommand.connect(playerOneSessionId);
      const { sessionId: playerTwoSessionId } = await joinGameCommand.execute(
        gameCode,
        { username: "AB" }
      );
      await connectUserTwoCommand.connect(playerTwoSessionId);
      await startGameCommand.execute(sessionId);
      await getAnswerCommand.execute(sessionId);

      currentQuestionNumberUpdater.clear(sessionId);

      await getNextQuestionCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot get next question. Question data could not be found."
      );
    } finally {
      connectGameCommand.disconnect();
      connectUserOneCommand.disconnect();
      connectUserTwoCommand.disconnect();
    }
  });

  it("On submission and questions is not set, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const joinGameCommand = new JoinGameCommand();
    const connectUserOneCommand = new ConnectToGameCommand();
    const connectUserTwoCommand = new ConnectToGameCommand();
    const getNextQuestionCommand = new GetNextQuestionCommand();
    const startGameCommand = new StartGameCommand();
    const getAnswerCommand = new GetAnswerCommand();
    const questionsUpdater = new QuestionsUpdater();

    try {
      // Action
      const { sessionId, gameCode } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      const { sessionId: playerOneSessionId } = await joinGameCommand.execute(
        gameCode,
        { username: "AA" }
      );
      await connectUserOneCommand.connect(playerOneSessionId);
      const { sessionId: playerTwoSessionId } = await joinGameCommand.execute(
        gameCode,
        { username: "AB" }
      );
      await connectUserTwoCommand.connect(playerTwoSessionId);
      await startGameCommand.execute(sessionId);
      await getAnswerCommand.execute(sessionId);

      questionsUpdater.clear(sessionId);

      await getNextQuestionCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot get next question. Question data could not be found."
      );
    } finally {
      connectGameCommand.disconnect();
      connectUserOneCommand.disconnect();
      connectUserTwoCommand.disconnect();
    }
  });

  it("On submission and question is the last question, returns correct errors", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const joinGameCommand = new JoinGameCommand();
    const connectUserOneCommand = new ConnectToGameCommand();
    const connectUserTwoCommand = new ConnectToGameCommand();
    const getNextQuestionCommand = new GetNextQuestionCommand();
    const startGameCommand = new StartGameCommand();
    const getAnswerCommand = new GetAnswerCommand();
    const currentQuestionNumberUpdater = new CurrentQuestionNumberUpdater();

    try {
      // Action
      const { sessionId, gameCode } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);
      const { sessionId: playerOneSessionId } = await joinGameCommand.execute(
        gameCode,
        { username: "AA" }
      );
      await connectUserOneCommand.connect(playerOneSessionId);
      const { sessionId: playerTwoSessionId } = await joinGameCommand.execute(
        gameCode,
        { username: "AB" }
      );
      await connectUserTwoCommand.connect(playerTwoSessionId);
      const { totalNumberOfQuestions } = await startGameCommand.execute(
        sessionId
      );
      await getAnswerCommand.execute(sessionId);

      await currentQuestionNumberUpdater.setQuestionNumber(
        sessionId,
        totalNumberOfQuestions
      );

      await getNextQuestionCommand.execute(sessionId);
      fail("This test should throw an error");
    } catch (e) {
      const commandError = e as RestCommandError;

      // Assert
      expect(commandError.statusCode).toBeDefined();
      expect(commandError.statusCode).toBe(400);
      expect(commandError.errorPayload.errorMessages).toBeDefined();
      expect(commandError.errorPayload.errorMessages).toHaveLength(1);
      expect(commandError.errorPayload.errorMessages[0]).toBe(
        "Cannot get next question. This was the last question."
      );
    } finally {
      connectGameCommand.disconnect();
      connectUserOneCommand.disconnect();
      connectUserTwoCommand.disconnect();
    }
  });

  // it("On submission and all data is ok, returns answer and all dynamo records are updated", async () => {
  //   // Arrange
  //   const playGameCommand = new PlayGameCommand();
  //   const startGameCommand = new StartGameCommand();
  //   const connectGameCommand = new ConnectGameCommand();
  //   const joinGameCommand = new JoinGameCommand();
  //   const connectUserOneCommand = new ConnectToGameCommand();
  //   const connectUserTwoCommand = new ConnectToGameCommand();
  //   const getAnswerCommand = new GetAnswerCommand();
  //   const gameSessionQuery = new GameSessionQuery();

  //   try {
  //     // Action
  //     const { sessionId, gameCode } = await playGameCommand.execute();
  //     await connectGameCommand.connect(sessionId);
  //     const { sessionId: firstPlayerSessionId } = await joinGameCommand.execute(
  //       gameCode,
  //       { username: "AA" }
  //     );
  //     await connectUserOneCommand.connect(firstPlayerSessionId);
  //     const { sessionId: secondPlayerSessionId } =
  //       await joinGameCommand.execute(gameCode, { username: "AB" });
  //     await connectUserTwoCommand.connect(secondPlayerSessionId);
  //     await startGameCommand.execute(sessionId);

  //     const { answer } = await getAnswerCommand.execute(sessionId);

  //     const gameSession = await gameSessionQuery.getData(sessionId);

  //     // Assert
  //     expect(answer).toBeDefined();
  //     expect(gameSession!.isAllowingSubmissions).toBe(false);
  //   } finally {
  //     connectGameCommand.disconnect();
  //     connectUserOneCommand.disconnect();
  //     connectUserTwoCommand.disconnect();
  //   }
  // });
});
