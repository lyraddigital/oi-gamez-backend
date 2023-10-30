import { verifyCorsAllowedOrigin } from "@oigamez/configuration/cors-allowed-origin";
import { verifyDynamoTableName } from "@oigamez/configuration/dynamo-table-name";
import { verifyGameCodeLength } from "@oigamez/configuration/game-code-length";

export const validateEnvironment = (): void => {
  verifyCorsAllowedOrigin();
  verifyDynamoTableName();
  verifyGameCodeLength();
};
