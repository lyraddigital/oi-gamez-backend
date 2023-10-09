const numberAttribute = (numberValue) => ({ N: numberValue.toString() });
const stringAttribute = (stringValue) => ({ S: stringValue });
const stringArrayAttribute = (stringValues) => ({ SS: stringValues });

const types = {
  gameSession: "Game",
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
};

export const expressions = {
  common: {
    keysExists: `attribute_exists(${dynamoFieldNames.common.pk}) AND attribute_exists(${dynamoFieldNames.common.sk})`,
  },
};

export const dynamofieldValues = {
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
};

export const gameSessionStatuses = {
  notActive: "Not Active",
  notStarted: "Not Started",
};

export const indexNames = {
  gameCodeIndex: "GameCode-index",
};

export const keys = {
  gameList: {
    [dynamoFieldNames.common.pk]: dynamofieldValues.gameList.pk,
    [dynamoFieldNames.common.sk]: dynamofieldValues.gameList.sk,
  },
  gameSession: (sessionId) => ({
    [dynamoFieldNames.common.pk]: dynamofieldValues.gameSession.pk(sessionId),
    [dynamoFieldNames.common.sk]: dynamofieldValues.gameSession.sk,
  }),
};
