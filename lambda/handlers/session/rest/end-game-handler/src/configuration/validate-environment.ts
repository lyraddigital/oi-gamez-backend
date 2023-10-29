import {
  verifyDynamoTableName,
  verifyPlayerWebsocketEndpoint,
} from "@oigamez/configuration";

export const validateEnvironment = (): void => {
  verifyDynamoTableName();
  verifyPlayerWebsocketEndpoint();
};
