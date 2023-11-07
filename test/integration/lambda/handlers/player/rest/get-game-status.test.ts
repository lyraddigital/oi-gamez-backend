import {
  ConnectGameCommand,
  GetGameStatusCommand,
  PlayGameCommand,
  RestCommandError,
} from "../../../shared/commands";
import { GameSessionStatuses } from "../../../shared/dynamodb";
import { AllGameCodesQuery } from "../../../shared/queries";
import { generateNewCode } from "../../../shared/services";
import {
  GameSessionNumberOfPlayersUpdater,
  GameSessionStatusUpdater,
} from "../../../shared/updaters";

describe("Game Status Handler", () => {
  describe("Invalid requests", () => {
    it("Getting a game's status with an invalid game code. Should return an error with correct messages.", async () => {
      // Arrange
      const invalidCode = "invalidCode";
      const getGameStatusCommand = new GetGameStatusCommand();

      // Action / Assert
      try {
        await getGameStatusCommand.execute(invalidCode);
        fail("This should not work, it should fail because we didn't send");
      } catch (e) {
        const commandError = e as RestCommandError;

        expect(commandError.statusCode).toBeDefined();
        expect(commandError.statusCode).toBe(400);
        expect(commandError.errorPayload).toBeDefined();
        expect(commandError.errorPayload.errorMessages).toBeDefined();
        expect(commandError.errorPayload.errorMessages.length).toBe(1);
        expect(commandError.errorPayload.errorMessages[0]).toBe(
          "Code must be 4 uppercase letters"
        );
      }
    });

    it("Getting a game's status with an valid game code, but game session is not found, returns correct status", async () => {
      // Arrange
      const getGameStatusCommand = new GetGameStatusCommand();
      const allGameCodesQuery = new AllGameCodesQuery();
      const gameCodes = await allGameCodesQuery.getData();
      const gameCode = generateNewCode(gameCodes);

      // Action
      const { reason, canJoin } = await getGameStatusCommand.execute(gameCode);

      // Assert
      expect(canJoin).toEqual(false);
      expect(reason).toBe("Not Found");
    });

    it("Getting a game's status with an valid game code, but game session is inactive, returns correct status", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const getGameStatusCommand = new GetGameStatusCommand();

      const { gameCode } = await playGameCommand.execute();

      // Action
      const { reason, canJoin } = await getGameStatusCommand.execute(gameCode);

      // Assert
      expect(canJoin).toEqual(false);
      expect(reason).toBe("Not Active");
    });

    it("Getting a game's status with an valid game code, but game session is in progress, returns correct status", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const getGameStatusCommand = new GetGameStatusCommand();
      const gameSessionStatusUpdater = new GameSessionStatusUpdater();

      const { sessionId, gameCode } = await playGameCommand.execute();
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.inProgress
      );

      // Action
      const { reason, canJoin } = await getGameStatusCommand.execute(gameCode);

      // Assert
      expect(canJoin).toEqual(false);
      expect(reason).toBe("In Progress");
    });

    it("Getting a game's status with an valid game code, but game session is completed, returns correct status", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const getGameStatusCommand = new GetGameStatusCommand();
      const gameSessionStatusUpdater = new GameSessionStatusUpdater();

      const { sessionId, gameCode } = await playGameCommand.execute();
      await gameSessionStatusUpdater.update(
        sessionId,
        GameSessionStatuses.completed
      );

      // Action
      const { reason, canJoin } = await getGameStatusCommand.execute(gameCode);

      // Assert
      expect(canJoin).toEqual(false);
      expect(reason).toBe("Completed");
    });

    it("Getting a game's status with an valid game code, but game session is full, returns correct status", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const getGameStatusCommand = new GetGameStatusCommand();
      const gameSessionNumberOfPlayersUpdater =
        new GameSessionNumberOfPlayersUpdater();

      try {
        const { sessionId, gameCode } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        await gameSessionNumberOfPlayersUpdater.update(sessionId, 8);

        // Action
        const { reason, canJoin } = await getGameStatusCommand.execute(
          gameCode
        );

        // Assert
        expect(canJoin).toEqual(false);
        expect(reason).toBe("Room is full");
      } finally {
        connectGameCommand.disconnect();
      }
    });
  });

  describe("Valid requests", () => {
    it("Getting a game's status and game can be joined, returns correct data.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const getGameStatusCommand = new GetGameStatusCommand();

      // Action
      try {
        const { sessionId, gameCode } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);

        const { reason, canJoin } = await getGameStatusCommand.execute(
          gameCode
        );

        // Assert
        expect(canJoin).toEqual(true);
        expect(reason).toBe("");
      } finally {
        connectGameCommand.disconnect();
      }
    });
  });
});
