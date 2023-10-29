interface EnvironmentVariables {
  playGame: PlayGameEnvironmentVariables;
}

interface PlayGameEnvironmentVariables {
  tableName: string;
  gameCodeLength: string;
  connectWindowInSeconds: string;
  gameSessionMinPlayers: string;
  gameSessionMaxPlayers: string;
}

interface HandlerFilePaths {
  gameSession: GameSessionHandlerFilePaths;
}

interface GameSessionHandlerFilePaths {
  playGame: string;
}

interface HandlerFunctionNames {
  gameSession: GameSessionFunctionNames;
}

interface GameSessionFunctionNames {
  playGame: string;
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
  },
};

export const HandlerFunctionNames: HandlerFunctionNames = {
  gameSession: {
    playGame: "handler",
  },
};
