interface EnvironmentVariables {
  playGame: PlayGameEnvironmentVariables;
  getAnswer: GetAnswerEnvironmentVariables;
  getNextQuestion: GetNextQuestionEnvironmentVariables;
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

interface HandlerFilePaths {
  gameSession: GameSessionHandlerFilePaths;
}

interface GameSessionHandlerFilePaths {
  playGame: string;
  getAnswer: string;
  getNextQuestion: string;
}

interface HandlerFunctionNames {
  gameSession: GameSessionFunctionNames;
}

interface GameSessionFunctionNames {
  playGame: string;
  getAnswer: string;
  getNextQuestion: string;
}

interface ResourcePaths {
  gameSession: GameSesssionResourcePaths;
}

interface GameSesssionResourcePaths {
  game: string;
  answers: string;
  questions: string;
  end: string;
}

export const EnvironmentVariables: EnvironmentVariables = {
  playGame: {
    tableName: "DYNAMO_TABLE_NAME",
    gameCodeLength: "GAME_CODE_LENGTH",
    connectWindowInSeconds: "CONNECT_WINDOW_IN_SECONDS",
    gameSessionMinPlayers: "GAME_SESSION_MIN_PLAYERS",
    gameSessionMaxPlayers: "GAME_SESSION_MAX_PLAYERS",
  },
  getAnswer: {
    tableName: "DYNAMO_TABLE_NAME",
    playerWebsocketEndpoint: "PLAYER_WEBSOCKET_ENDPOINT",
  },
  getNextQuestion: {
    tableName: "DYNAMO_TABLE_NAME",
    playerWebsocketEndpoint: "PLAYER_WEBSOCKET_ENDPOINT",
  },
};

export const ResourcePaths: ResourcePaths = {
  gameSession: {
    answers: "answers",
    game: "games",
    questions: "questions",
    end: "end",
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
  },
};

export const HandlerFunctionNames: HandlerFunctionNames = {
  gameSession: {
    playGame: "handler",
    getAnswer: "handler",
    getNextQuestion: "handler",
  },
};
