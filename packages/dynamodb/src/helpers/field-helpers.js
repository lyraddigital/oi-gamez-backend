export const numberAttribute = (numberValue) => ({ N: numberValue.toString() });
export const stringAttribute = (stringValue) => ({ S: stringValue });
export const stringArrayAttribute = (stringValues) => ({ SS: stringValues });
export const booleanAttribute = (boolValue) => ({ BOOL: boolValue.toString() });

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

export const getDynamoSet = (dynamoField) => {
  return dynamoField?.SS || [];
};

export const getDynamoList = (dynamoField) => {
  return dynamoField?.L || [];
};

export const getDynamoMap = (dynamoField) => {
  return dynamoField?.M || {};
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
    answers: "Answers",
    status: "Status",
    currentNumberOfPlayers: "CurrentNumberOfPlayers",
    currentQuestionNumber: "CurrentQuestionNumber",
    connectionId: "HostConnectionId",
    isAllowingSubmissions: "IsAllowingSubmissions",
    sessionId: "SessionId",
    gameCode: "GameCode",
    minPlayers: "MinPlayers",
    maxPlayers: "MaxPlayers",
    questions: "Questions",
  },
  player: {
    hostSessionId: "HostSessionId",
    sessionId: "PlayerSessionId",
    username: "Username",
    connectionId: "PlayerConnectionId",
  },
  questionGroupCount: {
    questionGroupCount: "QuestionGroupCount",
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
    connectionId: (connectionId) => stringAttribute(connectionId),
  },
  questionGroup: {
    pk: (questionGroupNumber) =>
      stringAttribute(`QuestionGroups#${questionGroupNumber}`),
    sk: stringAttribute("#Metadata"),
  },
  questionGroupCount: {
    pk: stringAttribute("QuestionGroups"),
    sk: stringAttribute("#List"),
  },
};

export const gameSessionStatuses = {
  notActive: "Not Active",
  notStarted: "Not Started",
  inProgress: "In Progress",
  completed: "Completed",
};

export const indexNames = {
  gameCodeIndex: "GameCode-index",
  playerSessionIndex: "PlayerSession-index",
  playerConnectionIndex: "PlayerConnection-index",
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
  player: (hostSessionId, playerSessionId) => ({
    [dynamoFieldNames.common.pk]: dynamoFieldValues.player.pk(hostSessionId),
    [dynamoFieldNames.common.sk]: dynamoFieldValues.player.sk(playerSessionId),
  }),
  questionGroupCount: {
    [dynamoFieldNames.common.pk]: dynamoFieldValues.questionGroupCount.pk,
    [dynamoFieldNames.common.sk]: dynamoFieldValues.questionGroupCount.sk,
  },
  questionGroup: (questionGroupNumber) => ({
    [dynamoFieldNames.common.pk]:
      dynamoFieldValues.questionGroup.pk(questionGroupNumber),
    [dynamoFieldNames.common.sk]: dynamoFieldValues.questionGroup.sk,
  }),
};
