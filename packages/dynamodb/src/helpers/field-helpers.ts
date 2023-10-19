import { AttributeValue } from "@aws-sdk/client-dynamodb";

import { Types } from "./enums";
import {
  DynamoConditionalExpressions,
  DynamoFieldNames,
  DynamoFieldValues,
  DynamoKeys,
} from "./types";

export const numberAttribute = (
  numberValue: number
): AttributeValue.NMember => ({
  N: numberValue.toString(),
});
export const stringAttribute = (
  stringValue: string
): AttributeValue.SMember => ({
  S: stringValue,
});
export const stringArrayAttribute = (
  stringValues: string[]
): AttributeValue.SSMember => ({
  SS: stringValues,
});
export const booleanAttribute = (
  boolValue: boolean
): AttributeValue.BOOLMember => ({
  BOOL: boolValue,
});

export const getDynamoString = (
  dynamoField: AttributeValue
): string | undefined => {
  return dynamoField?.S;
};

export const getDynamoInt = (
  dynamoField: AttributeValue
): number | undefined => {
  return dynamoField?.N ? parseInt(dynamoField.N) : undefined;
};

export const getDynamoSet = (dynamoField: AttributeValue): string[] => {
  return dynamoField?.SS || [];
};

export const getDynamoList = (
  dynamoField: AttributeValue
): AttributeValue[] => {
  return dynamoField?.L || [];
};

export const getDynamoBoolean = (
  dynamoField: AttributeValue
): boolean | undefined => {
  return dynamoField?.BOOL;
};

export const getDynamoMap = (dynamoField: AttributeValue) => {
  return dynamoField?.M;
};

export const dynamoFieldNames: DynamoFieldNames = {
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
    choices: "QuestionChoices",
  },
  questionGroupCount: {
    questionGroupCount: "QuestionGroupCount",
  },
};

export const expressions: DynamoConditionalExpressions = {
  common: {
    keysExists: `attribute_exists(${dynamoFieldNames.common.pk}) AND attribute_exists(${dynamoFieldNames.common.sk})`,
  },
};

export const dynamoFieldValues: DynamoFieldValues = {
  gameList: {
    pk: stringAttribute("Game"),
    sk: stringAttribute("#List"),
    gameCodes: (codes) => stringArrayAttribute(codes),
  },
  gameSession: {
    pk: (sessionId) => stringAttribute(`Game#${sessionId}`),
    sk: stringAttribute("#Metadata"),
    type: stringAttribute(Types.gameSession),
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
    type: stringAttribute(Types.player),
    ttl: (ttl) => numberAttribute(ttl),
    hostSessionId: (gameSessionId) => stringAttribute(gameSessionId),
    sessionId: (playerSessionId) => stringAttribute(playerSessionId),
    username: (username) => stringAttribute(username),
    connectionId: (connectionId) => stringAttribute(connectionId),
    choices: (choices) => {
      const choiceDynamoMap: AttributeValue.MMember = { M: {} };

      choices.forEach((value: string, key: number) => {
        choiceDynamoMap.M[key.toString()] = stringAttribute(value);
      });

      return choiceDynamoMap;
    },
  },
  questionGroup: {
    pk: (questionGroupNumber: number) =>
      stringAttribute(`QuestionGroups#${questionGroupNumber}`),
    sk: stringAttribute("#Metadata"),
  },
  questionGroupCount: {
    pk: stringAttribute("QuestionGroups"),
    sk: stringAttribute("#List"),
  },
};

export const keys: DynamoKeys = {
  gameList: {
    PK: dynamoFieldValues.gameList.pk,
    SK: dynamoFieldValues.gameList.sk,
  },
  gameSession: (sessionId) => ({
    PK: dynamoFieldValues.gameSession.pk(sessionId),
    SK: dynamoFieldValues.gameSession.sk,
  }),
  player: (hostSessionId, playerSessionId) => ({
    PK: dynamoFieldValues.player.pk(hostSessionId),
    SK: dynamoFieldValues.player.sk(playerSessionId),
  }),
  questionGroupCount: {
    PK: dynamoFieldValues.questionGroupCount.pk,
    SK: dynamoFieldValues.questionGroupCount.sk,
  },
  questionGroup: (questionGroupNumber) => ({
    PK: dynamoFieldValues.questionGroup.pk(questionGroupNumber),
    SK: dynamoFieldValues.questionGroup.sk,
  }),
};
