import { ConnectGameCommand, PlayGameCommand } from "../../../shared/commands";

describe("Connect Game Handler", () => {
  describe("Invalid requests", () => {
    test("On connect with no session id. Returns socket error.", async () => {
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

    test("On connect with invalid session id. Returns socket error.", async () => {
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
    test("On connect with no session id. Returns socket error.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();

      // Action / Assert
      try {
        const { sessionId } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
      } catch (e) {
        fail(`Unexpected error: ${e}`);
      } finally {
        connectGameCommand.disconnect();
      }
    });
  });
});
