const numberAttribute = (numberValue) => ({ N: numberValue.toString() });
const stringAttribute = (stringValue) => ({ S: stringValue });
const stringArrayAttribute = (stringValues) => ({ SS: stringValues });

const types = {
  gameSession: "Game",
};

export const fieldNames = {
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
    keysExists: `attribute_exists(${fieldNames.common.pk}) AND attribute_exists(${fieldNames.common.sk})`,
  },
};

export const fieldValues = {
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

export const keys = {
  gameList: {
    [fieldNames.common.pk]: fieldValues.gameList.pk,
    [fieldNames.common.sk]: fieldValues.gameList.sk,
  },
  gameSession: (sessionId) => ({
    [fieldNames.common.pk]: fieldValues.gameSession.pk(sessionId),
    [fieldNames.common.sk]: fieldValues.gameSession.sk,
  }),
};
