const numberAttribute = (numberValue) => ({ N: numberValue.toString() });
const stringAttribute = (stringValue) => ({ S: stringValue });
const stringArrayAttribute = (stringValues) => ({ SS: stringValues });

const types = {
  gameSession: "Game",
  player: "Player",
};

export const getDynamoString = (dynamoField) => {
  return dynamoField?.S;
};

export const getDynamoInt = (dynamoField) => {
  return dynamoField?.N ? parseInt(dynamoField.N) : undefined;
};

export const getListOfString = (dynamoField) => {
  return dynamoField?.SS || [];
};

export const dynamoFieldNames = {
  common: {
    pk: "PK",
    sk: "SK",
    type: "Type",
    ttl: "TTL",
  },
  gameList: {
    gameCodes: "GameCodes",
  },
  gameSession: {
    status: "Status",
    currentNumberOfPlayers: "CurrentNumberOfPlayers",
    connectionId: "ConnectionId",
    sessionId: "SessionId",
    gameCode: "GameCode",
    minPlayers: "MinPlayers",
    maxPlayers: "MaxPlayers",
  },
  player: {
    hostSessionId: "HostSessionId",
    sessionId: "PlayerSessionId",
    username: "Username",
  },
};

export const expressions = {
  common: {
    keysExists: `attribute_exists(${dynamoFieldNames.common.pk}) AND attribute_exists(${dynamoFieldNames.common.sk})`,
  },
};

export const dynamoFieldValues = {
  gameList: {
    pk: stringAttribute("Game"),
    sk: stringAttribute("#List"),
    gameCodes: (codes) => stringArrayAttribute(codes),
  },
  gameSession: {
    pk: (sessionId) => stringAttribute(`Game#${sessionId}`),
    sk: stringAttribute("#Metadata"),
    type: stringAttribute(types.gameSession),
    status: (status) => stringAttribute(status),
    currentNumberOfPlayers: (count) => numberAttribute(count),
    connectionId: (connectionId) => stringAttribute(connectionId),
    gameCode: (gameCode) => stringAttribute(gameCode),
    minPlayers: (minPlayers) => numberAttribute(minPlayers),
    maxPlayers: (maxPlayers) => numberAttribute(maxPlayers),
    sessionId: (sessionId) => stringAttribute(sessionId),
    ttl: (ttl) => numberAttribute(ttl),
  },
  player: {
    pk: (gameSessionId) => stringAttribute(`Game#${gameSessionId}`),
    sk: (playerSessionId) => stringAttribute(`#Players#${playerSessionId}`),
    skPrefix: stringAttribute(`#Players#`),
    type: stringAttribute(types.player),
    ttl: (ttl) => numberAttribute(ttl),
    hostSessionId: (gameSessionId) => stringAttribute(gameSessionId),
    sessionId: (playerSessionId) => stringAttribute(playerSessionId),
    username: (username) => stringAttribute(username),
  },
};

export const gameSessionStatuses = {
  notActive: "Not Active",
  notStarted: "Not Started",
  completed: "Completed",
};

export const indexNames = {
  gameCodeIndex: "GameCode-index",
  playerSessionIndex: "PlayerSession-index",
};

export const keys = {
  gameList: {
    [dynamoFieldNames.common.pk]: dynamoFieldValues.gameList.pk,
    [dynamoFieldNames.common.sk]: dynamoFieldValues.gameList.sk,
  },
  gameSession: (sessionId) => ({
    [dynamoFieldNames.common.pk]: dynamoFieldValues.gameSession.pk(sessionId),
    [dynamoFieldNames.common.sk]: dynamoFieldValues.gameSession.sk,
  }),
};
