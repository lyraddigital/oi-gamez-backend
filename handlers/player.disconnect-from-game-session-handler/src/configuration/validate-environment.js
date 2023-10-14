import {
  verifyDynamoTableName,
  verifyGameSessionWebsocketEndpoint,
} from "@oigamez/configuration";

export const validateEnvironment = () => {
  verifyDynamoTableName();
  verifyGameSessionWebsocketEndpoint();
};
