import { GameSession, Player } from "../../../shared/models";
import {
  ConnectGameCommand,
  ConnectToGameCommand,
  JoinGameCommand,
  PlayGameCommand,
} from "../../../shared/commands";
import { GameSessionStatuses } from "../../../shared/dynamodb";
import { GameSessionQuery, PlayerQuery } from "../../../shared/queries";
import {
  GameSessionNumberOfPlayersUpdater,
  GameSessionStatusUpdater,
} from "../../../shared/updaters";

describe("Connect To Game Handler", () => {
  describe("Invalid requests", () => {
    it("On connect with no session id. Returns socket error.", async () => {
      // Arrange
      const connectToGameCommand = new ConnectToGameCommand();

      // Action / Assert
      try {
        await connectToGameCommand.connect(undefined);
      } catch (e) {
        expect(e).toBe("Unexpected server response: 400");
      } finally {
        connectToGameCommand.disconnect();
      }
    });

    it("On connect with invalid session id. Returns socket error.", async () => {
      // Arrange
      const connectToGameCommand = new ConnectToGameCommand();
      const nonExistingSessionId = "randomSesssionId";

      // Action / Assert
      try {
        await connectToGameCommand.connect(nonExistingSessionId);
      } catch (e) {
        expect(e).toBe("Unexpected server response: 400");
      } finally {
        connectToGameCommand.disconnect();
      }
    });

    it("On connect to an inactive game session. Returns socket error.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const connectToGameCommand = new ConnectToGameCommand();
      const gameSessionStatusUpdater = new GameSessionStatusUpdater();

      // Action / Assert
      try {
        const { sessionId, gameCode } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        const { sessionId: playerSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );
        await gameSessionStatusUpdater.update(
          sessionId,
          GameSessionStatuses.notActive
        );

        await connectToGameCommand.connect(playerSessionId);
      } catch (e) {
        expect(e).toBe("Unexpected server response: 400");
      } finally {
        connectGameCommand.disconnect();
        connectToGameCommand.disconnect();
      }
    });

    it("On connect to an completed game session. Returns socket error.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const connectToGameCommand = new ConnectToGameCommand();
      const gameSessionStatusUpdater = new GameSessionStatusUpdater();

      // Action / Assert
      try {
        const { sessionId, gameCode } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        const { sessionId: playerSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );
        await gameSessionStatusUpdater.update(
          sessionId,
          GameSessionStatuses.completed
        );

        await connectToGameCommand.connect(playerSessionId);
      } catch (e) {
        expect(e).toBe("Unexpected server response: 400");
      } finally {
        connectGameCommand.disconnect();
        connectToGameCommand.disconnect();
      }
    });

    it("On connect to a game that is full. Returns socket error.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const connectToGameCommand = new ConnectToGameCommand();
      const gameSessionNumberOfPlayersUpdater =
        new GameSessionNumberOfPlayersUpdater();

      // Action / Assert
      try {
        const { sessionId, gameCode } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        const { sessionId: playerSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );
        await gameSessionNumberOfPlayersUpdater.update(playerSessionId, 8);

        await connectToGameCommand.connect(sessionId);
      } catch (e) {
        expect(e).toBe("Unexpected server response: 400");
      } finally {
        connectGameCommand.disconnect();
        connectToGameCommand.disconnect();
      }
    });
  });

  describe("Valid requests", () => {
    it("On connect with valid session id. Connects successfully and saves the updated info to dynamo.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const connectToGameCommand = new ConnectToGameCommand();
      const gameSessionQuery = new GameSessionQuery();
      const playerQuery = new PlayerQuery();

      try {
        const { sessionId, gameCode } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        const { sessionId: playerSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );
        const preConnectGameSession = await gameSessionQuery.getData(sessionId);
        const preConnectPlayer = await playerQuery.get(
          sessionId,
          playerSessionId
        );

        // Action
        await connectToGameCommand.connect(playerSessionId);

        // Assert
        const gameSession = await gameSessionQuery.getData(sessionId);

        expect(preConnectGameSession).toBeDefined();
        expect(gameSession).toBeDefined();
        expect(preConnectGameSession!.currentNumberOfPlayers).toBe(0);
        expect(gameSession!.currentNumberOfPlayers).toBe(1);

        const player = await playerQuery.get(sessionId, playerSessionId);

        expect(preConnectPlayer).toBeDefined();
        expect(player).toBeDefined();
        expect(preConnectPlayer!.connectionId).toBeUndefined();
        expect(player!.connectionId).toBeDefined();
        expect(preConnectPlayer!.ttl).not.toEqual(player!.ttl);
        expect(player!.ttl).toEqual(gameSession!.ttl);
      } finally {
        connectGameCommand.disconnect();
        connectToGameCommand.disconnect();
      }
    });

    it("On reconnect before game start. Connects successfully and saves the updated info to dynamo.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const connectToGameCommand = new ConnectToGameCommand();
      const gameSessionQuery = new GameSessionQuery();
      const playerQuery = new PlayerQuery();

      try {
        const { sessionId, gameCode } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        const { sessionId: playerSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );

        const preFirstConnectGameSession = await gameSessionQuery.getData(
          sessionId
        );
        const preFirstConnectPlayer = await playerQuery.get(
          sessionId,
          playerSessionId
        );

        await connectToGameCommand.connect(playerSessionId);

        const firstConnectGameSession = await gameSessionQuery.getData(
          sessionId
        );
        const firstConnectPlayer = await playerQuery.get(
          sessionId,
          playerSessionId
        );

        await connectToGameCommand.disconnect();

        const disconnectPlayer = await playerQuery.get(
          sessionId,
          playerSessionId
        );
        const disconnectGameSession = await gameSessionQuery.getData(sessionId);

        const { sessionId: newPlaySessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );

        // Action
        await connectToGameCommand.connect(newPlaySessionId);

        const secondConnectGameSession = await gameSessionQuery.getData(
          sessionId
        );
        const secondConnectPlayer = await playerQuery.get(
          sessionId,
          newPlaySessionId
        );

        // Assert
        expect(preFirstConnectPlayer).toBeDefined();
        expect(preFirstConnectGameSession).toBeDefined();
        expect(firstConnectPlayer).toBeDefined();
        expect(firstConnectGameSession).toBeDefined();
        expect(disconnectPlayer).toBeUndefined();
        expect(disconnectGameSession).toBeDefined();
        expect(secondConnectPlayer).toBeDefined();
        expect(secondConnectGameSession).toBeDefined();
        expect(preFirstConnectPlayer!.connectionId).toBeUndefined();
        expect(preFirstConnectGameSession!.currentNumberOfPlayers).toBe(0);
        expect(firstConnectPlayer!.connectionId).toBeDefined();
        expect(firstConnectGameSession!.currentNumberOfPlayers).toBe(1);
        expect(disconnectGameSession!.currentNumberOfPlayers).toBe(0);
        expect(secondConnectPlayer!.connectionId).toBeDefined();
        expect(secondConnectGameSession!.currentNumberOfPlayers).toBe(1);
      } finally {
        connectGameCommand.disconnect();
        connectToGameCommand.disconnect();
      }
    });

    it("On reconnect during progress. Connects successfully and saves the updated info to dynamo.", async () => {
      // Arrange
      const playGameCommand = new PlayGameCommand();
      const connectGameCommand = new ConnectGameCommand();
      const joinGameCommand = new JoinGameCommand();
      const connectToGameCommand = new ConnectToGameCommand();
      const gameSessionQuery = new GameSessionQuery();
      const playerQuery = new PlayerQuery();
      const gameSessionStatusUpdater = new GameSessionStatusUpdater();

      try {
        const { sessionId, gameCode } = await playGameCommand.execute();
        await connectGameCommand.connect(sessionId);
        const { sessionId: playerSessionId } = await joinGameCommand.execute(
          gameCode,
          { username: "AA" }
        );

        const preFirstConnectGameSession = await gameSessionQuery.getData(
          sessionId
        );
        const preFirstConnectPlayer = await playerQuery.get(
          sessionId,
          playerSessionId
        );

        await connectToGameCommand.connect(playerSessionId);

        const firstConnectGameSession = await gameSessionQuery.getData(
          sessionId
        );
        const firstConnectPlayer = await playerQuery.get(
          sessionId,
          playerSessionId
        );

        await gameSessionStatusUpdater.update(
          sessionId,
          GameSessionStatuses.inProgress
        );

        await connectToGameCommand.disconnect();

        const disconnectPlayer = await playerQuery.get(
          sessionId,
          playerSessionId
        );
        const disconnectGameSession = await gameSessionQuery.getData(sessionId);

        // Action
        await connectToGameCommand.connect(playerSessionId);

        const secondConnectGameSession = await gameSessionQuery.getData(
          sessionId
        );
        const secondConnectPlayer = await playerQuery.get(
          sessionId,
          playerSessionId
        );

        // Assert
        expect(preFirstConnectPlayer).toBeDefined();
        expect(preFirstConnectGameSession).toBeDefined();
        expect(firstConnectPlayer).toBeDefined();
        expect(firstConnectGameSession).toBeDefined();
        expect(disconnectPlayer).toBeDefined();
        expect(disconnectGameSession).toBeDefined();
        expect(secondConnectPlayer).toBeDefined();
        expect(secondConnectGameSession).toBeDefined();
        expect(preFirstConnectPlayer!.connectionId).toBeUndefined();
        expect(preFirstConnectGameSession!.currentNumberOfPlayers).toBe(0);
        expect(firstConnectPlayer!.connectionId).toBeDefined();
        expect(firstConnectGameSession!.currentNumberOfPlayers).toBe(1);
        expect(disconnectPlayer!.connectionId).toBeUndefined();
        expect(disconnectGameSession!.currentNumberOfPlayers).toBe(1);
        expect(secondConnectPlayer!.connectionId).toBeDefined();
        expect(secondConnectGameSession!.currentNumberOfPlayers).toBe(1);
      } finally {
        connectGameCommand.disconnect();
        connectToGameCommand.disconnect();
      }
    });
  });
});
