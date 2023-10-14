import {
  verifyDynamoTableName,
  verifyPlayerWebsocketEndpoint,
} from "@oigamez/configuration";

export const validateEnvironment = () => {
  verifyDynamoTableName();
  verifyPlayerWebsocketEndpoint();
};
