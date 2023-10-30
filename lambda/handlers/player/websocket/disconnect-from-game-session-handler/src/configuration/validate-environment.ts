import {
  verifyDynamoTableName,
  verifyGameSessionWebsocketEndpoint,
} from "@oigamez/configuration";

export const validateEnvironment = (): void => {
  verifyDynamoTableName();
  verifyGameSessionWebsocketEndpoint();
};
