import { AttributeValue } from "@aws-sdk/client-dynamodb";

interface CommonFieldNames {
  pk: string;
  sk: string;
  type: string;
  ttl: string;
}

interface GameListFieldNames {
  gameCodes: string;
}

interface GameSessionFieldNames {
  answers: string;
  status: string;
  currentNumberOfPlayers: string;
  currentQuestionNumber: string;
  connectionId: string;
  isAllowingSubmissions: string;
  sessionId: string;
  gameCode: string;
  minPlayers: string;
  maxPlayers: string;
  questions: string;
}

interface PlayerFieldNames {
  hostSessionId: string;
  sessionId: string;
  username: string;
  connectionId: string;
}

interface QuestionGroupCountFieldNames {
  questionGroupCount: string;
}

interface GameListFieldValues {
  pk: AttributeValue.SMember;
  sk: AttributeValue.SMember;
  gameCodes: (codes: string[]) => AttributeValue.SSMember;
}

interface GameSessionFieldValues {
  pk: (sessionId: string) => AttributeValue.SMember;
  sk: AttributeValue.SMember;
  type: AttributeValue.SMember;
  status: (status: string) => AttributeValue.SMember;
  currentNumberOfPlayers: (count: number) => AttributeValue.NMember;
  connectionId: (connectionId: string) => AttributeValue.SMember;
  gameCode: (gameCode: string) => AttributeValue.SMember;
  minPlayers: (minPlayers: number) => AttributeValue.NMember;
  maxPlayers: (maxPlayers: number) => AttributeValue.NMember;
  sessionId: (sessionId: string) => AttributeValue.SMember;
  ttl: (ttl: number) => AttributeValue.NMember;
}

interface PlayerFieldValues {
  pk: (gameSessionId: string) => AttributeValue.SMember;
  sk: (playerSessionId: string) => AttributeValue.SMember;
  skPrefix: AttributeValue.SMember;
  type: AttributeValue.SMember;
  ttl: (ttl: number) => AttributeValue.NMember;
  hostSessionId: (gameSessionId: string) => AttributeValue.SMember;
  sessionId: (playerSessionId: string) => AttributeValue.SMember;
  username: (username: string) => AttributeValue.SMember;
  connectionId: (connectionId: string) => AttributeValue.SMember;
}

interface QuestionGroupFieldValues {
  pk: (questionGroupNumber: number) => AttributeValue.SMember;
  sk: AttributeValue.SMember;
}

interface QuestionGroupCountFieldValues {
  pk: AttributeValue.SMember;
  sk: AttributeValue.SMember;
}

interface CommonConditionalExpressions {
  keysExists: string;
}

interface DynamoKey {
  PK: AttributeValue.SMember;
  SK: AttributeValue.SMember;
}

export interface DynamoConditionalExpressions {
  common: CommonConditionalExpressions;
}

export interface DynamoFieldNames {
  common: CommonFieldNames;
  gameList: GameListFieldNames;
  gameSession: GameSessionFieldNames;
  player: PlayerFieldNames;
  questionGroupCount: QuestionGroupCountFieldNames;
}

export interface DynamoFieldValues {
  gameList: GameListFieldValues;
  gameSession: GameSessionFieldValues;
  player: PlayerFieldValues;
  questionGroup: QuestionGroupFieldValues;
  questionGroupCount: QuestionGroupCountFieldValues;
}

export interface DynamoKeys {
  gameList: DynamoKey & Record<string, AttributeValue>;
  gameSession: (
    sessionId: string
  ) => DynamoKey & Record<string, AttributeValue>;
  player: (
    hostSessionId: string,
    playerSessionId: string
  ) => DynamoKey & Record<string, AttributeValue>;
  questionGroupCount: DynamoKey & Record<string, AttributeValue>;
  questionGroup: (
    questionGroupNumber: number
  ) => DynamoKey & Record<string, AttributeValue>;
}
