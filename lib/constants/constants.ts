interface EnvironmentVariables {
  playGame: PlayGameEnvironmentVariables;
  getAnswer: GetAnswerEnvironmentVariables;
  getNextQuestion: GetNextQuestionEnvironmentVariables;
  endGame: EndGameEnvironmentVariables;
  joinGame: JoinGameEnvironmentVariables;
  getGameStatus: GetGameStatusEnvironmentVariables;
}

interface PlayGameEnvironmentVariables {
  tableName: string;
  gameCodeLength: string;
  connectWindowInSeconds: string;
  gameSessionMinPlayers: string;
  gameSessionMaxPlayers: string;
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

interface HandlerFilePaths {
  gameSession: GameSessionHandlerFilePaths;
  player: PlayerHandlerFilePaths;
}

interface GameSessionHandlerFilePaths {
  playGame: string;
  getAnswer: string;
  getNextQuestion: string;
  endGame: string;
}

interface PlayerHandlerFilePaths {
  joinGame: string;
  getGameStatus: string;
}

interface HandlerFunctionNames {
  gameSession: GameSessionFunctionNames;
  player: PlayerFunctionNames;
}

interface GameSessionFunctionNames {
  playGame: string;
  getAnswer: string;
  getNextQuestion: string;
  endGame: string;
}

interface PlayerFunctionNames {
  joinGame: string;
  getGameStatus: string;
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
}

export const EnvironmentVariables: EnvironmentVariables = {
  playGame: {
    tableName: "DYNAMO_TABLE_NAME",
    gameCodeLength: "GAME_CODE_LENGTH",
    connectWindowInSeconds: "CONNECT_WINDOW_IN_SECONDS",
    gameSessionMinPlayers: "GAME_SESSION_MIN_PLAYERS",
    gameSessionMaxPlayers: "GAME_SESSION_MAX_PLAYERS",
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
};

export const ResourcePaths: ResourcePaths = {
  gameSession: {
    answers: "answers",
    game: "games",
    questions: "questions",
    end: "end",
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
    getAnswer:
      "../../../lambda/handlers/session/rest/get-answer-handler/src/index.ts",
    getNextQuestion:
      "../../../lambda/handlers/session/rest/get-next-question-handler/src/index.ts",
    endGame:
      "../../../lambda/handlers/session/rest/end-game-handler/src/index.ts",
  },
  player: {
    joinGame:
      "../../../lambda/handlers/player/rest/join-game-handler/src/index.ts",
    getGameStatus:
      "../../../lambda/handlers/player/rest/get-game-status-handler/src/index.ts",
  },
};

export const HandlerFunctionNames: HandlerFunctionNames = {
  gameSession: {
    playGame: "handler",
    getAnswer: "handler",
    getNextQuestion: "handler",
    endGame: "handler",
  },
  player: {
    joinGame: "handler",
    getGameStatus: "handler",
  },
};

export const HeaderNames: HeaderNames = {
  all: {
    contentType: "Content-Type",
    apiSessionId: "API-SESSION-ID",
  },
};

export const IndexNames: IndexNames = {
  gameCodeIndex: "GameCode-index",
};
