import { verifyCorsAllowedOrigin } from "@oigamez/configuration/cors-allowed-origin";
import { verifyDynamoTableName } from "@oigamez/configuration/dynamo-table-name";

export const validateEnvironment = (): void => {
  verifyCorsAllowedOrigin();
  verifyDynamoTableName();
};
