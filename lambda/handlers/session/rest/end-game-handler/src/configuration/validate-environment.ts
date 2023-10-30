import { verifyDynamoTableName } from "@oigamez/configuration/dynamo-table-name";
import { verifyPlayerWebsocketEndpoint } from "@oigamez/configuration/player-websocket-endpoint";

export const validateEnvironment = (): void => {
  verifyDynamoTableName();
  verifyPlayerWebsocketEndpoint();
};
