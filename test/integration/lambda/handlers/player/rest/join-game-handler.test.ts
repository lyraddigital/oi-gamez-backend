import {
  ConnectGameCommand,
  JoinGameCommand,
  RestCommandError,
  PlayGameCommand,
} from "../../../shared/commands";

describe("Join Game Handler", () => {
  describe("Invalid requests", () => {
    test("Joining a game with an no game code or username passed. Should return an error with correct messages.", async () => {
      // Arrange
      const joinGameCommand = new JoinGameCommand();

      // Action / Assert
      try {
        await joinGameCommand.execute();
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
  });
});
