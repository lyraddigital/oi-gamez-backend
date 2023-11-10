import {
  ChooseOptionCommand,
  ChooseOptionCommandRequest,
  ConnectGameCommand,
  ConnectToGameCommand,
  JoinGameCommand,
  PlayGameCommand,
  RestCommandError,
  StartGameCommand,
} from "../../../shared/commands";
import { PlayerQuery } from "../../../shared/queries";
import {
  GameSessionAllowSubmissionsUpdater,
  PlayerHostSessionUpdater,
} from "../../../shared/updaters";

describe("Choose Option Handler", () => {
  describe("Invalid requests", () => {
    it("Choosing an option without the session id or option, should return an error with correct messages.", async () => {
      // Arrange
      const chooseOptionCommand = new ChooseOptionCommand();
      const chooseOptionGameRequest: ChooseOptionCommandRequest = {};

      // Action / Assert
      try {
        await chooseOptionCommand.execute(undefined, chooseOptionGameRequest);
        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(2);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Session id could not be found. Make sure you've sent it"
        );
        expect(commandError.errorPayload.errorMessages[1]).toBe(
          "Option id could not be found. Make sure you've sent it"
        );
      }
    });

    it("Choosing an option but forgetting the option in payload, should return an error with correct messages.", async () => {
      // Arrange
      const sessionId = "394849403";
      const chooseOptionCommand = new ChooseOptionCommand();
      const chooseOptionGameRequest: ChooseOptionCommandRequest = {};

      // Action / Assert
      try {
        await chooseOptionCommand.execute(sessionId, chooseOptionGameRequest);
        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Option id could not be found. Make sure you've sent it"
        );
      }
    });

    it("Choosing an option but forgetting the session id in payload, should return an error with correct messages.", async () => {
      // Arrange
      const chooseOptionCommand = new ChooseOptionCommand();
      const chooseOptionGameRequest: ChooseOptionCommandRequest = {
        optionId: "1",
      };

      // Action / Assert
      try {
        await chooseOptionCommand.execute(undefined, chooseOptionGameRequest);
        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Session id could not be found. Make sure you've sent it"
        );
      }
    });

    it("Choosing an option but session id does not match a player, should return an error with correct messages.", async () => {
      // Arrange
      const sessionId = "madeUpPlayerSessionId";
      const chooseOptionCommand = new ChooseOptionCommand();
      const chooseOptionGameRequest: ChooseOptionCommandRequest = {
        optionId: "1",
      };

      // Action / Assert
      try {
        await chooseOptionCommand.execute(sessionId, chooseOptionGameRequest);
        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Cannot choose option for the current question. Could not determine the player who was choosing."
        );
      }
    });

    it("Choosing an option but host session id does not match a game session, should return an error with correct messages.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const connectUserOneToGameCommand = new ConnectToGameCommand();
      const connectUserTwoToGameCommand = new ConnectToGameCommand();
      const startGameCommand = new StartGameCommand();
      const chooseOptionCommand = new ChooseOptionCommand();
      const playerHostSessionUpdater = new PlayerHostSessionUpdater();

      // Action / Assert
      try {
        const { gameCode, sessionId } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        const { sessionId: playerOneSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );
        await connectUserOneToGameCommand.connect(playerOneSessionId);
        const { sessionId: playerTwoSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AB" }
        );
        await connectUserTwoToGameCommand.connect(playerTwoSessionId);
        const { question } = await startGameCommand.execute(sessionId);
        const randomChoiceId = question.options[0].optionId;

        await playerHostSessionUpdater.update(
          sessionId,
          playerOneSessionId,
          "thisIsNotTheCorrectSessionId"
        );

        await chooseOptionCommand.execute(playerOneSessionId, {
          optionId: randomChoiceId,
        });

        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Cannot choose option for the current question. Could not determine the game that the choice was for."
        );
      } finally {
        connectGameCommand.disconnect();
        connectUserOneToGameCommand.disconnect();
        connectUserTwoToGameCommand.disconnect();
      }
    });

    it("Choosing an option but host session id matches a game that is not allowing submissions, should return an error with correct messages.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const connectUserOneToGameCommand = new ConnectToGameCommand();
      const connectUserTwoToGameCommand = new ConnectToGameCommand();
      const startGameCommand = new StartGameCommand();
      const chooseOptionCommand = new ChooseOptionCommand();
      const gameSessionAllowSubmissionsUpdater =
        new GameSessionAllowSubmissionsUpdater();

      // Action / Assert
      try {
        const { gameCode, sessionId } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        const { sessionId: playerOneSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );
        await connectUserOneToGameCommand.connect(playerOneSessionId);
        const { sessionId: playerTwoSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AB" }
        );
        await connectUserTwoToGameCommand.connect(playerTwoSessionId);
        const { question } = await startGameCommand.execute(sessionId);
        const randomChoiceId = question.options[0].optionId;

        await gameSessionAllowSubmissionsUpdater.update(sessionId, false);

        await chooseOptionCommand.execute(playerOneSessionId, {
          optionId: randomChoiceId,
        });

        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Cannot choose option for the current question. Could not determine the game that the choice was for."
        );
      } finally {
        connectGameCommand.disconnect();
        connectUserOneToGameCommand.disconnect();
        connectUserTwoToGameCommand.disconnect();
      }
    });

    it("Choosing an option and all details valid, should succeed and correct data is saved.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const connectUserOneToGameCommand = new ConnectToGameCommand();
      const connectUserTwoToGameCommand = new ConnectToGameCommand();
      const startGameCommand = new StartGameCommand();
      const chooseOptionCommand = new ChooseOptionCommand();
      const playerQuery = new PlayerQuery();

      // Action
      try {
        const { gameCode, sessionId } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        const { sessionId: playerOneSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );
        await connectUserOneToGameCommand.connect(playerOneSessionId);
        const { sessionId: playerTwoSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AB" }
        );
        await connectUserTwoToGameCommand.connect(playerTwoSessionId);
        const { question } = await startGameCommand.execute(sessionId);
        const randomChoiceId = question.options[0].optionId;

        await chooseOptionCommand.execute(playerOneSessionId, {
          optionId: randomChoiceId,
        });

        // Assert
        const player = await playerQuery.get(sessionId, playerOneSessionId);
        expect(player?.choices.size).toBe(1);
        expect(player?.choices.get(1)).toBe(randomChoiceId);
      } finally {
        connectGameCommand.disconnect();
        connectUserOneToGameCommand.disconnect();
        connectUserTwoToGameCommand.disconnect();
      }
    });
  });
});
