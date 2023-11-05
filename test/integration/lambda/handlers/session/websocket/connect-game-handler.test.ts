import { ConnectGameCommand, PlayGameCommand } from "../../../shared/commands";
import { GameSessionStatuses } from "../../../shared/dynamodb";
import { GameSessionQuery } from "../../../shared/queries";

describe("Connect Game Handler", () => {
  describe("Invalid requests", () => {
    it("On connect with no session id. Returns socket error.", async () => {
      // Arrange
      const connectGameCommand = new ConnectGameCommand();

      // Action / Assert
      try {
        await connectGameCommand.connect(undefined);
      } catch (e) {
        expect(e).toBe("Unexpected server response: 400");
      } finally {
        connectGameCommand.disconnect();
      }
    });

    it("On connect with invalid session id. Returns socket error.", async () => {
      // Arrange
      const connectGameCommand = new ConnectGameCommand();
      const nonExistingSessionId = "randomSesssionId";

      // Action / Assert
      try {
        await connectGameCommand.connect(nonExistingSessionId);
      } catch (e) {
        expect(e).toBe("Unexpected server response: 400");
      } finally {
        connectGameCommand.disconnect();
      }
    });
  });

  describe("Valid requests", () => {
    it("On connect with valid session id. Connects successfully and saves the updated info to dynamo.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const gameSessionQuery = new GameSessionQuery();

      try {
        const { sessionId } = await playGameCommand.execute();
        const originalGameSession = await gameSessionQuery.getData(sessionId);

        // Action
        await connectGameCommand.connect(sessionId);

        // Assert
        const gameSession = await gameSessionQuery.getData(sessionId);
        expect(gameSession).toBeDefined();
        expect(gameSession!.status).toBe(GameSessionStatuses.notStarted);
        expect(gameSession!.ttl).toBeGreaterThan(originalGameSession!.ttl);
      } catch (e) {
        fail(`Unexpected error: ${e}`);
      } finally {
        connectGameCommand.disconnect();
      }
    });
  });
});
