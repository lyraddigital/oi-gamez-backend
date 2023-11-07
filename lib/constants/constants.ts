interface EnvironmentVariables {
  playGame: PlayGameEnvironmentVariables;
  startGame: StartGameEnvironmentVariables;
  getAnswer: GetAnswerEnvironmentVariables;
  getNextQuestion: GetNextQuestionEnvironmentVariables;
  endGame: EndGameEnvironmentVariables;
  joinGame: JoinGameEnvironmentVariables;
  getGameStatus: GetGameStatusEnvironmentVariables;
  chooseOption: ChooseOptionEnvironmentVariables;
  connectGame: ConnectGameEnvironmentVariables;
  connectToGame: ConnectToGameEnvironmentVariables;
  disconnectFromGame: DisconnectFromGameEnvironmentVariables;
  gameSessionExpiryJob: GameSessionExpiryJobEnvironmentVariables;
}

interface PlayGameEnvironmentVariables {
  tableName: string;
  gameCodeLength: string;
  connectWindowInSeconds: string;
  gameSessionMinPlayers: string;
  gameSessionMaxPlayers: string;
}

interface StartGameEnvironmentVariables {
  tableName: string;
  playerWebsocketEndpoint: string;
}

interface GetAnswerEnvironmentVariables {
  tableName: string;
  playerWebsocketEndpoint: string;
}

interface GetNextQuestionEnvironmentVariables {
  tableName: string;
  playerWebsocketEndpoint: string;
}

interface EndGameEnvironmentVariables {
  tableName: string;
  playerWebsocketEndpoint: string;
}

interface JoinGameEnvironmentVariables {
  tableName: string;
  gameCodeLength: string;
  connectWindowInSeconds: string;
  corsAllowedOrigins: string;
}

interface GetGameStatusEnvironmentVariables {
  tableName: string;
  gameCodeLength: string;
  corsAllowedOrigins: string;
}

interface ChooseOptionEnvironmentVariables {
  tableName: string;
  corsAllowedOrigins: string;
}

interface ConnectGameEnvironmentVariables {
  tableName: string;
  updatedConnectWindowInSeconds: string;
}

interface ConnectToGameEnvironmentVariables {
  tableName: string;
  gameSessionWebsocketEndpoint: string;
}

interface DisconnectFromGameEnvironmentVariables {
  tableName: string;
  gameSessionWebsocketEndpoint: string;
}

interface GameSessionExpiryJobEnvironmentVariables {
  tableName: string;
}

interface HandlerFilePaths {
  gameSession: GameSessionHandlerFilePaths;
  player: PlayerHandlerFilePaths;
}

interface GameSessionHandlerFilePaths {
  playGame: string;
  startGame: string;
  getAnswer: string;
  getNextQuestion: string;
  endGame: string;
  connectGame: string;
  expiryJob: string;
}

interface PlayerHandlerFilePaths {
  joinGame: string;
  getGameStatus: string;
  chooseOption: string;
  connectToGame: string;
  disconnectFromGame: string;
}

interface HandlerFunctionNames {
  gameSession: GameSessionFunctionNames;
  player: PlayerFunctionNames;
}

interface GameSessionFunctionNames {
  playGame: string;
  startGame: string;
  getAnswer: string;
  getNextQuestion: string;
  endGame: string;
  connectGame: string;
  expiryJob: string;
}

interface PlayerFunctionNames {
  joinGame: string;
  getGameStatus: string;
  chooseOption: string;
  connectToGame: string;
  disconnectFromGame: string;
}

interface ResourcePaths {
  gameSession: GameSesssionResourcePaths;
  player: PlayerResourcePaths;
}

interface GameSesssionResourcePaths {
  game: string;
  answers: string;
  questions: string;
  end: string;
  start: string;
}

interface PlayerResourcePaths {
  choices: string;
  game: string;
  gameCode: string;
  status: string;
  players: string;
}

interface HeaderNames {
  all: AllHeaderNames;
}

interface AllHeaderNames {
  contentType: string;
  apiSessionId: string;
}

interface IndexNames {
  gameCodeIndex: string;
  playerSessionIndexName: string;
  playerConnectionIndexName: string;
}

export const EnvironmentVariables: EnvironmentVariables = {
  playGame: {
    tableName: "DYNAMO_TABLE_NAME",
    gameCodeLength: "GAME_CODE_LENGTH",
    connectWindowInSeconds: "CONNECT_WINDOW_IN_SECONDS",
    gameSessionMinPlayers: "GAME_SESSION_MIN_PLAYERS",
    gameSessionMaxPlayers: "GAME_SESSION_MAX_PLAYERS",
  },
  startGame: {
    tableName: "DYNAMO_TABLE_NAME",
    playerWebsocketEndpoint: "PLAYER_WEBSOCKET_ENDPOINT",
  },
  endGame: {
    tableName: "DYNAMO_TABLE_NAME",
    playerWebsocketEndpoint: "PLAYER_WEBSOCKET_ENDPOINT",
  },
  getAnswer: {
    tableName: "DYNAMO_TABLE_NAME",
    playerWebsocketEndpoint: "PLAYER_WEBSOCKET_ENDPOINT",
  },
  getNextQuestion: {
    tableName: "DYNAMO_TABLE_NAME",
    playerWebsocketEndpoint: "PLAYER_WEBSOCKET_ENDPOINT",
  },
  joinGame: {
    tableName: "DYNAMO_TABLE_NAME",
    gameCodeLength: "GAME_CODE_LENGTH",
    connectWindowInSeconds: "CONNECT_WINDOW_IN_SECONDS",
    corsAllowedOrigins: "CORS_ALLOWED_ORIGINS",
  },
  getGameStatus: {
    tableName: "DYNAMO_TABLE_NAME",
    gameCodeLength: "GAME_CODE_LENGTH",
    corsAllowedOrigins: "CORS_ALLOWED_ORIGINS",
  },
  chooseOption: {
    tableName: "DYNAMO_TABLE_NAME",
    corsAllowedOrigins: "CORS_ALLOWED_ORIGINS",
  },
  connectGame: {
    tableName: "DYNAMO_TABLE_NAME",
    updatedConnectWindowInSeconds: "UPDATED_CONNECT_WINDOW_IN_SECONDS",
  },
  connectToGame: {
    tableName: "DYNAMO_TABLE_NAME",
    gameSessionWebsocketEndpoint: "GAME_SESSION_WEBSOCKET_ENDPOINT",
  },
  disconnectFromGame: {
    tableName: "DYNAMO_TABLE_NAME",
    gameSessionWebsocketEndpoint: "GAME_SESSION_WEBSOCKET_ENDPOINT",
  },
  gameSessionExpiryJob: {
    tableName: "DYNAMO_TABLE_NAME",
  },
};

export const ResourcePaths: ResourcePaths = {
  gameSession: {
    answers: "answers",
    game: "games",
    questions: "questions",
    end: "end",
    start: "start",
  },
  player: {
    choices: "choices",
    game: "games",
    gameCode: "{code}",
    status: "status",
    players: "players",
  },
};

export const HandlerFilePaths: HandlerFilePaths = {
  gameSession: {
    playGame:
      "../../../lambda/handlers/session/rest/play-game-handler/src/index.ts",
    startGame:
      "../../../lambda/handlers/session/rest/start-game-handler/src/index.ts",
    getAnswer:
      "../../../lambda/handlers/session/rest/get-answer-handler/src/index.ts",
    getNextQuestion:
      "../../../lambda/handlers/session/rest/get-next-question-handler/src/index.ts",
    endGame:
      "../../../lambda/handlers/session/rest/end-game-handler/src/index.ts",
    connectGame:
      "../../../lambda/handlers/session/websocket/connect-game-session-handler/src/index.ts",
    expiryJob: "../../lambda/dynamo-db/game-session-expiry-job/src/index.ts",
  },
  player: {
    joinGame:
      "../../../lambda/handlers/player/rest/join-game-handler/src/index.ts",
    getGameStatus:
      "../../../lambda/handlers/player/rest/get-game-status-handler/src/index.ts",
    chooseOption:
      "../../../lambda/handlers/player/rest/choose-option-handler/src/index.ts",
    connectToGame:
      "../../../lambda/handlers/player/websocket/connect-to-game-session-handler/src/index.ts",
    disconnectFromGame:
      "../../../lambda/handlers/player/websocket/disconnect-from-game-session-handler/src/index.ts",
  },
};

export const HandlerFunctionNames: HandlerFunctionNames = {
  gameSession: {
    playGame: "handler",
    startGame: "handler",
    getAnswer: "handler",
    getNextQuestion: "handler",
    endGame: "handler",
    connectGame: "handler",
    expiryJob: "handler",
  },
  player: {
    joinGame: "handler",
    getGameStatus: "handler",
    chooseOption: "handler",
    connectToGame: "handler",
    disconnectFromGame: "handler",
  },
};

export const HeaderNames: HeaderNames = {
  all: {
    contentType: "Content-Type",
    apiSessionId: "api-session-id",
  },
};

export const IndexNames: IndexNames = {
  gameCodeIndex: "GameCode-index",
  playerSessionIndexName: "PlayerSession-index",
  playerConnectionIndexName: "PlayerConnection-index",
};
