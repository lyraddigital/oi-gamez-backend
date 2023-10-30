import { verifyDynamoTableName } from "@oigamez/configuration/dynamo-table-name";
import { verifyGameSessionWebsocketEndpoint } from "@oigamez/configuration/game-session-websocket-endpoint";

export const validateEnvironment = (): void => {
  verifyDynamoTableName();
  verifyGameSessionWebsocketEndpoint();
};
