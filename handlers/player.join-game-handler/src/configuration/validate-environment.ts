import {
  verifyCorsAllowedOrigin,
  verifyConnectionWindowInSeconds,
  verifyDynamoTableName,
  verifyGameCodeLength,
} from "@oigamez/configuration";

export const validateEnvironment = (): void => {
  verifyCorsAllowedOrigin();
  verifyConnectionWindowInSeconds();
  verifyDynamoTableName();
  verifyGameCodeLength();
};
