import {
  ConnectGameCommand,
  JoinGameCommand,
  JoinGameCommandRequest,
  RestCommandError,
  PlayGameCommand,
} from "../../../shared/commands";
import { GameSessionStatuses } from "../../../shared/dynamodb";
import { AllGameCodesQuery, PlayerQuery } from "../../../shared/queries";
import { generateNewCode } from "../../../shared/services";
import { GameSessionStatusUpdater } from "../../../shared/updaters";

describe("Join Game Handler", () => {
  describe("Invalid requests", () => {
    it("Joining a game with an invalid code and no username passed. Should return an error with correct messages.", async () => {
      // Arrange
      const invalidCode = "invalidCode";
      const joinGameCommand = new JoinGameCommand();
      const joinGameRequest: JoinGameCommandRequest = {};

      // Action / Assert
      try {
        await joinGameCommand.execute(invalidCode, joinGameRequest);
        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(2);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Code must be 4 uppercase letters"
        );
        expect(commandError.errorPayload.errorMessages[1]).toBe(
          "Username is required"
        );
      }
    });

    it("Joining a game with an valid code but no username passed. Should return an error with correct messages.", async () => {
      // Arrange
      const gameCode = "ABCD";
      const joinGameCommand = new JoinGameCommand();
      const joinGameRequest: JoinGameCommandRequest = {};

      // Action / Assert
      try {
        await joinGameCommand.execute(gameCode, joinGameRequest);
        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Username is required"
        );
      }
    });

    it("Joining a game with an valid code but username is less than 2 characters. Should return an error with correct messages.", async () => {
      // Arrange
      const gameCode = "ABCD";
      const joinGameCommand = new JoinGameCommand();
      const joinGameRequest: JoinGameCommandRequest = {
        username: "A",
      };

      // Action / Assert
      try {
        await joinGameCommand.execute(gameCode, joinGameRequest);
        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Username must be at least 2 characters"
        );
      }
    });

    it("Joining a game with an valid data, but game session could not be found. Should return an error with correct messages.", async () => {
      // Arrange
      const allGameCodesQuery = new AllGameCodesQuery();
      const joinGameCommand = new JoinGameCommand();
      const joinGameRequest: JoinGameCommandRequest = {
        username: "AA",
      };

      // Action / Assert
      try {
        const gameCodes = await allGameCodesQuery.getData();
        const gameCode = generateNewCode(gameCodes);
        await joinGameCommand.execute(gameCode, joinGameRequest);

        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Can't find the game session for the passed in game code."
        );
      }
    });

    it("Joining a game with an valid data, but game session status was inactive. Should return an error with correct messages.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const joinGameRequest: JoinGameCommandRequest = {
        username: "AA",
      };

      // Action / Assert
      try {
        const { gameCode } = await playGameCommand.execute();
        await joinGameCommand.execute(gameCode, joinGameRequest);

        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          'Can\'t join game. The game is not in a "Not Started" status'
        );
      }
    });

    it("Joining a game with an valid data, and game session status was in progress. Should return an error with correct messages.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const gameSessionStatusUpdater = new GameSessionStatusUpdater();
      const joinGameRequest: JoinGameCommandRequest = {
        username: "AA",
      };

      // Action / Assert
      try {
        const { gameCode, sessionId } = await playGameCommand.execute();
        await gameSessionStatusUpdater.update(
          sessionId,
          GameSessionStatuses.inProgress
        );

        await joinGameCommand.execute(gameCode, joinGameRequest);

        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          'Can\'t join game. The game is not in a "Not Started" status'
        );
      }
    });

    it("Joining a game with an valid data, and game session status was completed. Should return an error with correct messages.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const gameSessionStatusUpdater = new GameSessionStatusUpdater();
      const joinGameRequest: JoinGameCommandRequest = {
        username: "AA",
      };

      // Action / Assert
      try {
        const { gameCode, sessionId } = await playGameCommand.execute();
        await gameSessionStatusUpdater.update(
          sessionId,
          GameSessionStatuses.completed
        );

        await joinGameCommand.execute(gameCode, joinGameRequest);

        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          'Can\'t join game. The game is not in a "Not Started" status'
        );
      }
    });
  });

  fit("Joining a game with an valid data, and room is empty. Should allow me to submit a join.", async () => {
    // Arrange
    const playGameCommand = new PlayGameCommand();
    const connectGameCommand = new ConnectGameCommand();
    const joinGameCommand = new JoinGameCommand();
    const playerQuery = new PlayerQuery();
    const joinGameRequest: JoinGameCommandRequest = {
      username: "AA",
    };

    try {
      const { gameCode, sessionId } = await playGameCommand.execute();
      await connectGameCommand.connect(sessionId);

      // Action
      const { sessionId: playerSessionId } = await joinGameCommand.execute(
        gameCode,
        joinGameRequest
      );

      // Assert
      expect(playerSessionId).toBeDefined();

      const player = await playerQuery.get(sessionId, playerSessionId);

      expect(player).toBeDefined();
      expect(player!.hostSessionId).toBe(sessionId);
      expect(player!.sessionId).toBe(playerSessionId);
      expect(player!.connectionId).toBeUndefined();
      expect(player!.username).toBe(joinGameRequest.username);
      expect(player!.choices.size).toBe(0);
      expect(player!.ttl).toBeGreaterThan(0);
    } finally {
      await connectGameCommand.disconnect();
    }
  });
});
