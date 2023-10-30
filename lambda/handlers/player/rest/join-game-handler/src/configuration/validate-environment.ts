import { verifyCorsAllowedOrigin } from "@oigamez/configuration/cors-allowed-origin";
import { verifyConnectionWindowInSeconds } from "@oigamez/configuration/connect-window-in-seconds";
import { verifyDynamoTableName } from "@oigamez/configuration/dynamo-table-name";
import { verifyGameCodeLength } from "@oigamez/configuration/game-code-length";

export const validateEnvironment = (): void => {
  verifyCorsAllowedOrigin();
  verifyConnectionWindowInSeconds();
  verifyDynamoTableName();
  verifyGameCodeLength();
};
